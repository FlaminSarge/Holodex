import { Selector } from "./Selector";
import { ToolButtonContainer } from "./ToolButtonContainer";

export function Toolbar() {
  return (
    <div className="flex w-full justify-between max-w-full p-2 flex-nowrap">
      <div className="shrink-0 mr-2 w-3/5 grow-0 basis-auto">
        <Selector />
      </div>
      <div className="ml-2 shrink-0 grow-0 basis-auto w-2/5">
        <ToolButtonContainer />
      </div>
    </div>
  );
}
