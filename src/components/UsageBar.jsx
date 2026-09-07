import React from 'react';

// 기본 한도를 20회로 세팅하고 기본값(default value)을 적용합니다.
export function UsageBar({ remaining = 20, total = 20 }) {
  // remaining이 total보다 커지거나 0보다 작아지는 것을 방지 (0~100% 범위 고정)
  const percentage = Math.max(0, Math.min(100, (remaining / total) * 100));

  return (
    <div style={{ width: '100%', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
        <span>오늘의 AI 피드백 남은 사용량</span>
        <span>{remaining} / {total}회 ({percentage.toFixed(0)}%)</span>
      </div>
      
      <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', marginTop: '6px' }}>
        <div 
          style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            // 잔여량이 20% 이하로 남았을 때는 경고색(빨간색), 평소에는 파란색
            backgroundColor: percentage <= 20 ? '#ff4d4f' : '#1890ff',
            transition: 'width 0.3s ease-in-out'
          }} 
        />
      </div>
    </div>
  );
}

export default UsageBar;