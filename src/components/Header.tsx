import type { ReactElement } from "react";

interface HeaderProps {
  dataVersion: string;
  gameVersion: string;
}

export function Header({ dataVersion, gameVersion }: HeaderProps): ReactElement {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo" aria-hidden="true">
          PB
        </span>
        <div>
          <h1 className="app-header__title">Palworld 配种计算器</h1>
          <p className="app-header__subtitle">
            帕鲁配种表 · Palworld breeding calculator
          </p>
        </div>
      </div>
      <p className="app-header__meta">
        游戏版本 {gameVersion} · 数据版本 {dataVersion}
      </p>
    </header>
  );
}