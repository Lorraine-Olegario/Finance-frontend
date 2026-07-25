/**
 * Registro de ícones do sistema.
 *
 * Cada ícone é importado do arquivo .svg correspondente via `?raw` (Vite),
 * e a tag <svg> externa é removida — apenas o innerHTML é mantido.
 * A tag <svg> é renderizada pelo componente SvgIcon.vue com:
 *   viewBox="0 0 24 24" fill="none" stroke="currentColor"
 *   stroke-linecap="round" stroke-linejoin="round"
 *
 * Convenção de nomes: kebab-case semântico (o que representa, não como parece).
 * Exemplo correto:  'search', 'edit', 'eye'
 * Exemplo errado:   'magnifier', 'pencil', 'openEye'
 *
 * Para adicionar um novo ícone:
 *   1. Crie o arquivo .svg em src/assets/icons/ com nome kebab-case
 *   2. Importe abaixo via `?raw`
 *   3. Adicione a entrada no objeto `icons`
 *   4. Documente em docs/naming-conventions.md §5 se for um novo padrão
 */

// ── Navegação ──────────────────────────────────────────────────────────────
import chevronLeftRaw from "./chevron-left.svg?raw";
import chevronRightRaw from "./chevron-right.svg?raw";
import chevronUpRaw from "./chevron-up.svg?raw";
import chevronDownRaw from "./chevron-down.svg?raw";

// ── Ações ──────────────────────────────────────────────────────────────────
import searchRaw from "./search.svg?raw";
import closeRaw from "./close.svg?raw";
import editRaw from "./edit.svg?raw";
import trashRaw from "./trash.svg?raw";
import playRaw from "./play.svg?raw";
import pauseRaw from "./pause.svg?raw";
import plusRaw from "./plus.svg?raw";
import filterRaw from "./filter.svg?raw";
import downloadRaw from "./download.svg?raw";
import uploadRaw from "./upload.svg?raw";

// ── Feedback / Status ──────────────────────────────────────────────────────
import infoRaw from "./info.svg?raw";
import alertCircleRaw from "./alert-circle.svg?raw";
import checkCircleRaw from "./check-circle.svg?raw";
import xCircleRaw from "./x-circle.svg?raw";
import alertTriangleRaw from "./alert-triangle.svg?raw";
import moreHorizontalRaw from "./more-horizontal.svg?raw";

// ── Visibilidade ───────────────────────────────────────────────────────────
import eyeRaw from "./eye.svg?raw";
import eyeOffRaw from "./eye-off.svg?raw";
import bellRaw from "./bell.svg?raw";

// ── Finanças / Gráficos ────────────────────────────────────────────────────
import dollarRaw from "./dollar.svg?raw";
import activityRaw from "./activity.svg?raw";
import trendingUpRaw from "./trending-up.svg?raw";
import trendingUpLineRaw from "./trending-up-line.svg?raw";
import trendingDownRaw from "./trending-down.svg?raw";
import pieChartRaw from "./pie-chart.svg?raw";
import barChartRaw from "./bar-chart.svg?raw";

// ── Layout / Navegação do sistema ──────────────────────────────────────────
import monitorRaw from "./monitor.svg?raw";
import gridRaw from "./grid.svg?raw";
import logoGridRaw from "./logo-grid.svg?raw";
import menuRaw from "./menu.svg?raw";

// ── Pessoas ────────────────────────────────────────────────────────────────
import usersRaw from "./users.svg?raw";
import userRaw from "./user.svg?raw";

// ── Data / Tempo ───────────────────────────────────────────────────────────
import calendarRaw from "./calendar.svg?raw";

// ── Utilitários ────────────────────────────────────────────────────────────
import refreshRaw from "./refresh.svg?raw";

// ── Configuração ───────────────────────────────────────────────────────────
import settingsRaw from "./settings.svg?raw";
import logoutRaw from "./logout.svg?raw";

/** Extrai o innerHTML do arquivo SVG bruto (remove a tag <svg> externa). */
function inner(raw) {
  return raw
    .replace(/<svg[^>]*>/i, "")
    .replace(/<\/svg>/i, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}

export const icons = {
  // ── Navegação ──────────────────────────────────────────────────────────────
  "chevron-left": inner(chevronLeftRaw),
  "chevron-right": inner(chevronRightRaw),
  "chevron-up": inner(chevronUpRaw),
  "chevron-down": inner(chevronDownRaw),

  // ── Ações ──────────────────────────────────────────────────────────────────
  search: inner(searchRaw),
  close: inner(closeRaw),
  edit: inner(editRaw),
  trash: inner(trashRaw),
  play: inner(playRaw),
  pause: inner(pauseRaw),
  plus: inner(plusRaw),
  filter: inner(filterRaw),
  download: inner(downloadRaw),
  upload: inner(uploadRaw),

  // ── Feedback / Status ──────────────────────────────────────────────────────
  info: inner(infoRaw),
  "alert-circle": inner(alertCircleRaw),
  "check-circle": inner(checkCircleRaw),
  "x-circle": inner(xCircleRaw),
  "alert-triangle": inner(alertTriangleRaw),
  "more-horizontal": inner(moreHorizontalRaw),

  // ── Visibilidade ───────────────────────────────────────────────────────────
  eye: inner(eyeRaw),
  "eye-off": inner(eyeOffRaw),
  bell: inner(bellRaw),

  // ── Finanças / Gráficos ────────────────────────────────────────────────────
  dollar: inner(dollarRaw),
  activity: inner(activityRaw),
  "trending-up": inner(trendingUpRaw),
  "trending-up-line": inner(trendingUpLineRaw),
  "trending-down": inner(trendingDownRaw),
  "pie-chart": inner(pieChartRaw),
  "bar-chart": inner(barChartRaw),

  // ── Layout / Navegação do sistema ──────────────────────────────────────────
  monitor: inner(monitorRaw),
  grid: inner(gridRaw),
  "logo-grid": inner(logoGridRaw),
  menu: inner(menuRaw),

  // ── Pessoas ────────────────────────────────────────────────────────────────
  users: inner(usersRaw),
  user: inner(userRaw),

  // ── Data / Tempo ───────────────────────────────────────────────────────────
  calendar: inner(calendarRaw),

  // ── Utilitários ────────────────────────────────────────────────────────────
  refresh: inner(refreshRaw),

  // ── Configuração ───────────────────────────────────────────────────────────
  settings: inner(settingsRaw),
  logout: inner(logoutRaw),
};
