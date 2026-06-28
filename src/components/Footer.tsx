import type { ReactElement } from "react";
import type { DataMetadata } from "../types/pal.ts";

interface FooterProps {
  metadata: DataMetadata;
}

export function Footer({ metadata }: FooterProps): ReactElement {
  return (
    <footer className="app-footer" data-testid="app-footer">
      <section className="app-footer__section">
        <h3>数据说明</h3>
        <ul>
          <li>游戏版本：{metadata.gameVersion}</li>
          <li>数据版本：{metadata.dataVersion}</li>
          <li>最后更新：{metadata.lastUpdated}</li>
          <li>数据来源：{metadata.sourceDescription}</li>
        </ul>
      </section>
      <section className="app-footer__section">
        <h3>免责声明</h3>
        <p>
          本站为非官方玩家工具，与 Pocketpair, Inc. 无隶属或合作关系。
          Palworld 及相关名称和素材的权利归其各自权利人所有。
        </p>
        <p lang="en">
          This is an unofficial fan-made tool and is not affiliated with
          Pocketpair, Inc. Palworld and related names are trademarks of
          their respective owners.
        </p>
      </section>
      <section className="app-footer__section app-footer__section--small">
        <p>
          反馈与建议：欢迎在 GitHub 仓库提交 Issue。
        </p>
      </section>
    </footer>
  );
}