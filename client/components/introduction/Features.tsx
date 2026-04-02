import { BookCopy, CalendarCheck, PieChart, UsersIcon } from "lucide-react";

const features = [
  {
    icon: UsersIcon,
    title: "與他人一起學習",
    description: "加入或建立讀書會，投入充滿活力的學習社群。與志同道合的人建立聯繫，分享知識，參與協同學習體驗。",
  },
  {
    icon: CalendarCheck,
    title: "舉辦學習活動",
    description: "組織實體和線上學習活動。主辦或參與各種學習事件，支援地圖定位與視訊會議。",
  },
  {
    icon: BookCopy,
    title: "即時協作文件",
    description: "透過 CRDT 技術實現無衝突的即時共同編輯。多人同時編輯同一份文件，自動同步，無需手動合併。",
  },
  {
    icon: PieChart,
    title: "學習分析儀表板",
    description: "追蹤個人學習歷程，透過圖表分析了解學習進度。設定每週目標，監控出勤率，獲得學習洞察。",
  },
];

const Features = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="font-display font-bold text-3xl mb-3">核心功能</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          從協作編輯到視訊會議，StudyTogether 提供完整的學習工具。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group flex gap-4 p-6 rounded-xl border border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base mb-1">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
