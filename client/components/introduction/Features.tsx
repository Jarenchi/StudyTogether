import { BookCopy, CalendarCheck, PieChart, UsersIcon } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const Features = () => {
  return (
    <div className="flex flex-wrap gap-6 mt-7 items-center justify-center">
      <Card className="max-w-md min-w-[25rem]">
        <CardHeader className="flex-col items-center">
          <div className="bg-primary rounded-full w-36 h-36 flex items-center justify-center mb-4">
            <UsersIcon size={80} color="white" />
          </div>
          <p className="text-2xl my-6 font-bold">與他人一起學習</p>
        </CardHeader>
        <CardContent>
          <p>透過加入或建立讀書會，投入一個充滿活力的學習社群。與志同道合的人建立聯繫，分享知識，參與協同學習體驗。</p>
        </CardContent>
      </Card>
      <Card className="max-w-md min-w-[25rem]">
        <CardHeader className="flex-col items-center">
          <div className="bg-primary rounded-full w-36 h-36 flex items-center justify-center mb-4">
            <CalendarCheck size={80} color="white" />
          </div>
          <p className="text-2xl my-6 font-bold">舉辦學習活動</p>
        </CardHeader>
        <CardContent>
          <p>
            超越虛擬領域，組織實體和線上學習活動。從我們的平台賦予您主辦和參與各種學習活動的能力，讓大家可以互相交流。
          </p>
        </CardContent>
      </Card>
      <Card className="max-w-md min-w-[25rem]">
        <CardHeader className="flex-col items-center">
          <div className="bg-primary rounded-full w-36 h-36 flex items-center justify-center mb-4">
            <BookCopy size={80} color="white" />
          </div>
          <p className="text-2xl my-6 font-bold">互動學習功能</p>
        </CardHeader>
        <CardContent>
          <p>
            透過直播、即時共同編輯文件和高效的成員管理工具，體驗豐富的教育環境。我們的平台提供多樣化的學習功能，滿足您獨特的學習喜好。
          </p>
        </CardContent>
      </Card>
      <Card className="max-w-md min-w-[25rem]">
        <CardHeader className="flex-col items-center">
          <div className="bg-primary rounded-full w-36 h-36 flex items-center justify-center mb-4">
            <PieChart size={80} color="white" />
          </div>
          <p className="text-2xl my-6 font-bold">學習分析</p>
        </CardHeader>
        <CardContent>
          <p>
            輕鬆追蹤個人學習歷程，透過圖表分析瞭解學習進度。監控學習時間，評估進展，獲得寶貴洞察，提升您的學習體驗。
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Features;
