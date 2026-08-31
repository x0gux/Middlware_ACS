import { useRoutes } from "react-router-dom";
import { Suspense } from "react";
import routes from "virtual:generated-pages-react";
import MenuBar from "./components/_CommonComponents/menubar";
import styled from "@emotion/styled";
import "./index.css";

function App() {
  const element = useRoutes(routes);

  return (
    <MainLayout>

      <MenuBar />
      <ContentArea>
        <Suspense fallback={<p>Loading...</p>}>
          {element}
        </Suspense>
      </ContentArea>
    </MainLayout>
  );
}

export default App;



const MainLayout = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden; 
`;

const ContentArea = styled.main`
  flex: 1; 
  height: 100%;
  overflow-y : scroll;
  overflow-x: hidden;
  box-sizing: border-box;
`;