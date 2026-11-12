import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";

type SampleType = "DP" | "STRING";

interface FormHeaderProps {
  sampleType: SampleType;
  setSampleType: (type: SampleType) => void;
  onLoadSample: () => void;
}

export function FormHeader({
  sampleType,
  setSampleType,
  onLoadSample,
}: FormHeaderProps) {
  return (
    <CardHeader className="pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CardTitle className="text-3xl flex items-center gap-3">
          <FileText className="w-8 h-8 text-amber-600" />
          Create Problem
        </CardTitle>

        <div className="flex flex-col md:flex-row gap-3">
          <SampleTypeToggle
            sampleType={sampleType}
            setSampleType={setSampleType}
          />

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onLoadSample}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Load Sample
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}

function SampleTypeToggle({
  sampleType,
  setSampleType,
}: Pick<FormHeaderProps, "sampleType" | "setSampleType">) {
  return (
    <div className="flex border rounded-md">
      <Button
        type="button"
        variant={sampleType === "DP" ? "default" : "outline"}
        size="sm"
        className="rounded-r-none"
        onClick={() => setSampleType("DP")}
      >
        DP Problem
      </Button>

      <Button
        type="button"
        variant={sampleType === "STRING" ? "default" : "outline"}
        size="sm"
        className="rounded-l-none"
        onClick={() => setSampleType("STRING")}
      >
        String Problem
      </Button>
    </div>
  );
}
