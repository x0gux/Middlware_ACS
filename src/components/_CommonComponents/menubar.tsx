import styled from "@emotion/styled";
import { useNavigate, useLocation } from "react-router-dom";

const MenuBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: "대시보드", path: "/" },
        { label: "맵 뷰", path: "/tuskmap" },
        { label: "작업 내역", path: "/tuskwork" },
        { label: "기기 목록", path: "/tuskdevice" },
    ];

    return (
        <SidebarContainer>
            <Logo onClick={() => navigate("/")}>TUSK ACS</Logo>

            <MenuGroup>
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.path}
                        isActive={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </MenuGroup>
        </SidebarContainer>
    );
};

export default MenuBar;


const SidebarContainer = styled.aside`
  width: 240px;
  height: 100%;
  background-color: var(--bg, #ffffff);
  border-right: 1px solid var(--border, #e5e4e7);
  
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  box-sizing: border-box;
  flex-shrink: 0;
`;



const Logo = styled.h1`
  font-size: 20px;
  font-weight: 800;
  color: var(--accent, #aa3bff);
  margin: 0 0 32px 12px;
  cursor: pointer;
`;

const MenuGroup = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItem = styled.button<{ isActive: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  
  text-align: left;
  font-size: 15px;
  font-weight: ${(p) => (p.isActive ? "700" : "500")};
  
  /* 활성화 상태에 따른 색상 및 배경 처리 */
  color: ${(p) => (p.isActive ? "var(--accent, #aa3bff)" : "var(--text, #6b6375)")};
  background-color: ${(p) => (p.isActive ? "var(--accent-bg, rgba(170, 59, 255, 0.1))" : "transparent")};
  
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--accent-bg, rgba(170, 59, 255, 0.08));
    color: var(--accent, #aa3bff);
  }
`;