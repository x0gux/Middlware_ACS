import styled from "@emotion/styled";
import type { ReactNode } from "react";

interface InfoCardProps {
    title: string;
    children: ReactNode;
}

interface InfoRowProps {
    label: string;
    children: ReactNode;
    color?: string;
    fontWeight?: number;
}

export const InfoCard = ({ title, children }: InfoCardProps) => (
    <Card>
        <CardTitle>{title}</CardTitle>
        {children}
    </Card>
);

export const InfoRow = ({
    label,
    children,
    color,
    fontWeight = 500,
}: InfoRowProps) => (
    <DataRow>
        <Label>{label}</Label>
        <Value style={{ color, fontWeight }}>
            {children}
        </Value>
    </DataRow>
);

const Card = styled.div`
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const CardTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
`;

const DataRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px dashed #f5f5f5;

    &:last-child {
        border-bottom: none;
    }
`;

const Label = styled.span`
    font-size: 14px;
    color: #666;
    font-weight: 500;
`;

const Value = styled.span`
    font-size: 15px;
    color: #111;
    text-align: right;
`;
