import styled from "@emotion/styled";
import type { TaskDto, TaskConfigDto, ReservationDto } from "../../types/work";

type TaskCardData = TaskDto | TaskConfigDto | ReservationDto | any;

interface TaskCardProps {
  data: TaskCardData;
  type: "work" | "mission" | "reservation";
  onClick?: () => void;
}

const getStatusStyle = (state?: string) => {
  switch (state?.toUpperCase()) {
    case "RUNNING":
    case "CREATED":
    case "진행중":
      return { bg: "#f3e8ff", color: "#7e22ce", label: state || "진행중" };
    case "PENDING":
    case "WAITING":
    case "대기중":
      return { bg: "#dbeafe", color: "#2563eb", label: state || "대기중" };
    case "COMPLETED":
    case "완료":
      return { bg: "#dcfce7", color: "#15803d", label: state || "완료" };
    case "CANCELLED":
    case "FAILED":
    case "실패":
      return { bg: "#fee2e2", color: "#b91c1c", label: state || "취소/실패" };
    default:
      return { bg: "#f3f4f6", color: "#4b5563", label: state || "대기" };
  }
};

const TaskCard = ({ data, type, onClick }: TaskCardProps) => {
  if (type === "work") {
    const task = data as TaskDto;
    const badge = getStatusStyle(task.state);
    const targetText = task.targets?.length ? task.targets.join(" → ") : "목적지 없음";

    return (
      <CardWrapper onClick={onClick}>
        <CardHeader>
          <CardTitle>작업 #{task.id}</CardTitle>
          <StatusBadge $bg={badge.bg} $color={badge.color}>
            {badge.label}
          </StatusBadge>
        </CardHeader>
        <CardContent>
          <InfoRow>
            <InfoLabel>이동 경로</InfoLabel>
            <InfoValue><strong>{targetText}</strong></InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>우선순위</InfoLabel>
            <InfoValue>{task.priority ?? "보통"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>출처</InfoLabel>
            <InfoValue>{task.origin}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>생성 시각</InfoLabel>
            <InfoValue>{new Date(task.createdAt).toLocaleTimeString()}</InfoValue>
          </InfoRow>
          {task.lastError && <ErrorText>오류: {task.lastError}</ErrorText>}
        </CardContent>
      </CardWrapper>
    );
  }

  if (type === "mission") {
    const mission = data as TaskConfigDto;
    return (
      <CardWrapper onClick={onClick}>
        <CardHeader>
          <CardTitle>{mission.name || "설정되지 않은 미션"}</CardTitle>
          <StatusBadge $bg="#dbeafe" $color="#2563eb">설정</StatusBadge>
        </CardHeader>
        <CardContent>
          <InfoRow>
            <InfoLabel>로봇 그룹</InfoLabel>
            <InfoValue><strong>{mission.robotGroup || "전체"}</strong></InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>컨테이너 타입</InfoLabel>
            <InfoValue>{mission.containerType ?? "기본"}</InfoValue>
          </InfoRow>
        </CardContent>
      </CardWrapper>
    );
  }

  const reservation = data as ReservationDto;
  const badge = getStatusStyle(reservation.status);

  return (
    <CardWrapper onClick={onClick}>
      <CardHeader>
        <CardTitle>예약 #{reservation.id}</CardTitle>
        <StatusBadge $bg={badge.bg} $color={badge.color}>
          {badge.label}
        </StatusBadge>
      </CardHeader>
      <CardContent>
        <InfoRow>
          <InfoLabel>예정 시간</InfoLabel>
          <InfoValue><strong>{reservation.scheduledTime || "-"}</strong></InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>할당 로봇</InfoLabel>
          <InfoValue>{reservation.robotId || "자동 할당"}</InfoValue>
        </InfoRow>
      </CardContent>
    </CardWrapper>
  );
};

export default TaskCard;

// ── Styled Components ──────────────────────────────────────────

const CardWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e9d5ff;
  border-radius: 16px;
  padding: 20px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(126, 34, 206, 0.12);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #581c87;
  margin: 0;
`;

const StatusBadge = styled.span<{ $bg: string; $color: string }>`
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  padding: 4px 10px;
  border-radius: 6px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

const InfoLabel = styled.span`
  color: #6b7280;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: #1f2937;

  strong {
    font-weight: 700;
    color: #3b0764;
  }
`;

const ErrorText = styled.p`
  font-size: 12px;
  color: #dc2626;
  margin: 4px 0 0 0;
  background-color: #fef2f2;
  padding: 6px 8px;
  border-radius: 6px;
`;