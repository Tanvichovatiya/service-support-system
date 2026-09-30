import HistoryItem from "./HistroyItem";


const HistoryTimeline = ({ history }) => {
  return (
    <div className="relative">
      <div className="absolute bottom-5 left-[19px] top-5 w-px bg-border-light" />

      <div className="space-y-6">
        {history.map((item) => (
          <HistoryItem
            key={item._id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoryTimeline;