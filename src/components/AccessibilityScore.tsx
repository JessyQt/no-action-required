import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface AccessibilityScoreProps {
  score: number;
}

export const AccessibilityScore = ({ score }: AccessibilityScoreProps) => {
  const getColor = (score: number) => {
    if (score >= 90) return "#22C55E";
    if (score >= 70) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="w-32 h-32 mx-auto">
      <CircularProgressbar
        value={score}
        text={`${score}%`}
        styles={buildStyles({
          textSize: "1.5rem",
          pathColor: getColor(score),
          textColor: getColor(score),
        })}
      />
    </div>
  );
};