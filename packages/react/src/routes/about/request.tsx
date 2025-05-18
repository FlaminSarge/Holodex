import { AboutHeading } from "@/components/about/Heading";
import { AddSubberForm } from "@/components/about/request/AddSubber";
import { AddVtuberForm } from "@/components/about/request/AddVtuber";
import { DeleteChannelForm } from "@/components/about/request/DeleteChannel";
import { ModifyInfoForm } from "@/components/about/request/ModifyInfo";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Label } from "@/shadcn/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

export function AboutRequest() {
  const { t } = useTranslation();
  const [type, setType] = useState("");

  return (
    <div className="flex gap-2 flex-col">
      <AboutHeading>{t("channelRequest.RequestType")}</AboutHeading>
      <RadioGroup className="flex flex-col gap-2" onValueChange={setType}>
        <RadioGroupItem value="addVtuber" className="sr-only" id="addVtuber" />
        <Label htmlFor="addVtuber">
          <RequestTypeRadioButton isSelected={type === "addVtuber"}>
            {t("channelRequest.Types.AddVtuber")}
          </RequestTypeRadioButton>
        </Label>
        <RadioGroupItem value="addSubber" className="sr-only" id="addSubber" />
        <Label htmlFor="addSubber">
          <RequestTypeRadioButton isSelected={type === "addSubber"}>
            {t("channelRequest.Types.AddClipper")}
          </RequestTypeRadioButton>
        </Label>
        <RadioGroupItem
          value="modifyInfo"
          className="sr-only"
          id="modifyInfo"
        />
        <Label htmlFor="modifyInfo">
          <RequestTypeRadioButton isSelected={type === "modifyInfo"}>
            {t("channelRequest.Types.ModifyExistingInfo")}
          </RequestTypeRadioButton>
        </Label>
        <RadioGroupItem value="delete" className="sr-only" id="delete" />
        <Label htmlFor="delete">
          <RequestTypeRadioButton isSelected={type === "delete"}>
            {t("channelRequest.Types.DeleteChannel")}
          </RequestTypeRadioButton>
        </Label>
      </RadioGroup>
      <div>{/* Making some space  */}</div>
      <Card>
        <CardContent>
          {type === "addVtuber" && <AddVtuberForm />}
          {type === "addSubber" && <AddSubberForm />}
          {type === "modifyInfo" && <ModifyInfoForm />}
          {type === "delete" && <DeleteChannelForm />}
        </CardContent>
      </Card>
    </div>
  );
}

function RequestTypeRadioButton({
  children,
  isSelected,
}: {
  children: ReactNode;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full cursor-pointer rounded-md border-2 border-primary p-4 transition-colors",
        {
          " ": isSelected,
        },
      )}
    >
      {children}
    </div>
  );
}
