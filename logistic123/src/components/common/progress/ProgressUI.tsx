interface ProgressProps {
  percent: number;
}

export default function ProgressUI(props: ProgressProps) {
  const { percent } = props;

  return (
    <div className="progress-ui">
      <div className="progress" style={{ width: `${percent}%` }} />
    </div>
  );
}
