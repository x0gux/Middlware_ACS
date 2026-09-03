import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import { fetchNodeStatus, fetchStorageStatus } from '../../api/Info';
import { moveRobot, rackMoveRobot, chargeRobot } from '../../api/manual';
import type { MapPointInfo } from '../../types/node';
import type { RobotStatus } from '../../types/device';
import type { StorageInfo } from '../../types/map';

type SelectedInfo =
  | { type: 'robot'; data: RobotStatus }
  | { type: 'node'; data: MapPointInfo }
  | null;

interface MapInfoModalProps {
  info: SelectedInfo;
  onClose: () => void;
}

type Command = 'move' | 'rackmove' | 'charge' | null;

export default function MapInfoModal({ info, onClose }: MapInfoModalProps) {
  const [command, setCommand] = useState<Command>(null);
  const [startNode, setStartNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [nodes, setNodes] = useState<MapPointInfo[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [storage, setStorage] = useState<StorageInfo[]>([]);
  const [targetStorage, setTargetStorage] = useState('');

  useEffect(() => {
    fetchNodeStatus().then(setNodes).catch((e) => console.error(e));
    fetchStorageStatus().then(setStorage).catch((e) => console.error(e));
  }, []);

  if (info?.type === 'node' && command !== null) {
    setCommand(null);
  }

  if (!info) return null;

  const isRobot = info.type === 'robot';

  const runCommand = async () => {
    if (!isRobot) return;
    setBusy(true);
    setMessage(null);
    try {
      const robotId = info.data.id;
      let result;
      if (command === 'move') result = await moveRobot(robotId, targetStorage);
      else if (command === 'rackmove') result = await rackMoveRobot(robotId, startNode, targetNode);
      else if (command === 'charge') result = await chargeRobot(robotId, targetNode);
      else return;

      setMessage(result.success ? '명령 전송 성공' : `실패 (${result.message ?? ''})`);
      setCommand(null);
    } catch (e) {
      setMessage(`명령 전송 실패: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  const title = isRobot ? '로봇 제어' : '노드 상세 정보';

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>{title}</h3>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <ModalBody>
          <InfoGroup>
            <Infoname>
              <MainText>
                {isRobot ? `로봇 ID: ${info.data.id}` : `노드: ${info.data.dataCode}`}
              </MainText>
              {isRobot && <SubText>배터리: {info.data.batteryCharge}%</SubText>}
              {isRobot && info.data.taskId && <SubText>현재 작업: {info.data.taskId}</SubText>}
              {!isRobot && (
                <SubText>
                  좌표: {info.data.x.toFixed(2)} / {info.data.y.toFixed(2)}
                </SubText>
              )}
            </Infoname>
          </InfoGroup>

          {isRobot && (
            <InfoGroup>
              <ActionButton onClick={() => { setCommand('move'); setMessage(null); }}>이동</ActionButton>
              <ActionButton onClick={() => { setCommand('rackmove'); setMessage(null); }}>랙 이동</ActionButton>
              <ActionButton onClick={() => { setCommand('charge'); setMessage(null); }}>충전</ActionButton>
            </InfoGroup>
          )}

          {command && (
            <MoveContainer>
              {command === 'rackmove' && (
                <Field>
                  <label>시작 지점</label>
                  <select value={startNode} onChange={(e) => setStartNode(e.target.value)}>
                    <option value="">선택</option>
                    {storage.map((s, i) => (
                      <option key={s.name} value={s.name}>{`S${i + 1} (${s.name})`}</option>
                    ))}
                  </select>
                </Field>
              )}

              <Field>
                <label>목적지</label>
                <select value={targetStorage} onChange={(e) => setTargetStorage(e.target.value)}>
                  <option value="">선택</option>
                  {storage.map((s, i) => (
                    <option key={s.name} value={s.name}>{`n${i + 1} (${s.name})${nodes[i]?.dataCode ? ` + (${nodes[i].dataCode})` : ''}`}</option>
                  ))}
                </select>
              </Field>

              <ActionButton onClick={runCommand} disabled={busy || (command !== 'charge' && !targetStorage)}>
                {busy ? '전송 중...' : '실행'}
              </ActionButton>
              <ActionButton onClick={() => setCommand(null)}>취소</ActionButton>
            </MoveContainer>
          )}

          {message && <MessageText success={message.startsWith('명령 전송 성공')}>{message}</MessageText>}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

const MoveContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: 100%;
  margin-top: 4px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }

  select {
    flex: 1;
    height: 36px;
    padding: 0 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: #fff;
  }
`;

const ActionButton = styled.button`
  height: 36px;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-family: 'PretendardVariable';

  &:hover:not(:disabled) {
    background: #eee;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MessageText = styled.p<{ success: boolean }>`
  font-size: 13px;
  color: ${(p) => (p.success ? '#2e7d32' : '#d32f2f')};
  margin: 0;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const Infoname = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 6px;
`;

const MainText = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111111;
  font-family: 'PretendardVariable', sans-serif;
  margin: 0;
`;

const SubText = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #444444;
  font-family: 'PretendardVariable', sans-serif;
  margin: 0;
  strong {
    color: #000000;
  }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translate(-0%, 20px) scale(0.95); }
  to { opacity: 1; transform: translate(-0%, 0px) scale(1); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  right: 8px;
  width: 30%;
  min-width: 320px;
  top: 50vh;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #242424;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  animation: ${slideUp} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid #444;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #ffffffff;
  border-bottom: 1px solid #fff6f6ff;
  h3 {
    margin: 0;
    font-size: 16px;
    color: #000000ff;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #383838ff;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  &:hover {
    color: #000;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #ecececff;
`;