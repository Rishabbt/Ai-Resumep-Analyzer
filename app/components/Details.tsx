import { cn } from "~/lib/utils";
import { Accordion, AccordionContent, AccordionHeader, AccordionItem } from "./Accordion";

const getClass = (score: number) => {
    if (score >= 70) return "hi";
    if (score >= 50) return "md";
    return "lo";
};

const CategoryHeader = ({ title, score }: { title: string; score: number }) => {
    const cls = getClass(score);
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--dark-text)" }}>{title}</span>
            <span
                className={`dark-score-badge ${cls === "hi" ? "dark-score-hi" : cls === "md" ? "dark-score-md" : "dark-score-lo"}`}
                style={{ fontSize: "11px" }}
            >
                {score}/100
            </span>
        </div>
    );
};

const CategoryContent = ({
    tips,
}: {
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "4px" }}>
            {tips.map((tip, i) => (
                <div key={i} className="dark-tip-row" style={{ alignItems: "flex-start" }}>
                    <div
                        className={`dark-tip-dot ${tip.type === "good" ? "good" : "warn"}`}
                        style={{ marginTop: "5px" }}
                    />
                    <div>
                        <div className="dark-tip-title">{tip.tip}</div>
                        <div className="dark-tip-explanation">{tip.explanation}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="dark-score-card" style={{ padding: 0, overflow: "hidden" }}>
            <Accordion>
                <AccordionItem id="tone-style">
                    <AccordionHeader itemId="tone-style">
                        <CategoryHeader title="Tone & Style" score={feedback.toneAndStyle.score} />
                    </AccordionHeader>
                    <AccordionContent itemId="tone-style">
                        <CategoryContent tips={feedback.toneAndStyle.tips} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem id="content">
                    <AccordionHeader itemId="content">
                        <CategoryHeader title="Content" score={feedback.content.score} />
                    </AccordionHeader>
                    <AccordionContent itemId="content">
                        <CategoryContent tips={feedback.content.tips} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem id="structure">
                    <AccordionHeader itemId="structure">
                        <CategoryHeader title="Structure" score={feedback.structure.score} />
                    </AccordionHeader>
                    <AccordionContent itemId="structure">
                        <CategoryContent tips={feedback.structure.tips} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem id="skills">
                    <AccordionHeader itemId="skills">
                        <CategoryHeader title="Skills" score={feedback.skills.score} />
                    </AccordionHeader>
                    <AccordionContent itemId="skills">
                        <CategoryContent tips={feedback.skills.tips} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Details;