import type { WorkingStatus } from "../../types/work";
import { cancelMission } from "../../api/manual";
import styled from "@emotion/styled";
import { useState } from "react";

interface WorkCardProps {
  data: WorkingStatus;
  onChanged?: () => void;
}

const WorkCard = ({ data, onChanged }: WorkCardProps) => {
  const { Key, Value } = data;
  const [busy, setBusy] = useState(false);

  // WorkingList의 Key는 taskId, MissionList/ReservationList의 Key는 mission code다.
  const cancelCode = Value.taskId || Key;
  const workingType = Value.workingType === 0 ? "Auto" : "Manual";

  const handleCancel = async () => {
    if (!cancelCode) return;
    setBusy(true);
    try {
      const r = await cancelMission(cancelCode);
      alert(r.success ? "취소 요청 완료" : `취소 실패 (${r.code}: ${r.message ?? ""})`);
      onChanged?.();
    } catch (e) {
      alert(`취소 실패: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DeviceCardLayout>
      <MainText>작업 ID: {Key}</MainText>
      <SubText>로봇 ID : {Value.robotId || "할당 대기중"}</SubText>
      <SubText>작업 타입 : {workingType}</SubText>
      <SubText>위치 : {Value.line} - {Value.rack}</SubText>
      {Value.errorCode && <SubText style={{ color: "#d32f2f" }}>에러 : {Value.errorCode}</SubText>}

      <div style={{ marginTop: "12px", borderTop: "1px dashed #ccc", paddingTop: "12px" }}>
        <SubText style={{ fontWeight: 600 }}>이동 경로:</SubText>
        {Value.targets && Value.targets.length > 0 ? (
          Value.targets.map((t, i) => (
            <MissionItem key={i}>
              {i + 1}. {t}
            </MissionItem>
          ))
        ) : (
          <SubText>경로 정보 없음</SubText>
        )}
      </div>

      <CancelButton onClick={handleCancel} disabled={busy || !cancelCode}>
        {busy ? "요청 중..." : "미션 취소"}
      </CancelButton>
    </DeviceCardLayout>
  );
};

export default WorkCard;

const DeviceCardLayout = styled.div`
  width: auto;
  height: auto;
  border: 1px solid #ddddddff;
  border-radius: 24px;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MainText = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  font-family: 'PretendardVariable';
  margin-bottom: 16px;
`;

const SubText = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  font-family: 'PretendardVariable';
  height: auto;
  margin: 0;
  margin-bottom: 8px;
`;

const MissionItem = styled.p`
  font-size: 14px;
  color: #555;
  margin: 4px 0;
  font-family: 'PretendardVariable';
`;

const CancelButton = styled.button`
  margin-top: 12px;
  align-self: flex-start;
  padding: 8px 14px;
  border: 1px solid #d32f2f;
  border-radius: 8px;
  background: #fff;
  color: #d32f2f;
  cursor: pointer;
  font-family: 'PretendardVariable';
  &:hover:not(:disabled) {
    background: #d32f2f;
    color: #fff;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;