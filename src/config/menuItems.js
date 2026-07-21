// Configuração centralizada dos itens do menu
// Adicione ou altere as opções aqui e elas serão refletidas em todos os menus

export const menuItems = [
  {
    id: 'dashboard',
    to: '/',
    label: 'Dashboard',
    icon: /* html */ `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    `,
    exact: true
  },
  {
    id: 'users',
    to: '/users',
    label: 'Usuários',
    icon: /* html */ `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    `,
    adminOnly: true
  },
  {
    id: 'portfolio',
    to: '/portfolio',
    label: 'Carteira',
    icon: /* html */ `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    `
  },
  {
    id: 'my-assets',
    to: '/my-assets',
    label: 'Ativos',
    icon: /* html */ `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    `
  },
  {
    id: 'observed',
    to: '/observed',
    label: 'Ativos Observados',
    icon: /* html */ `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    `
  },
  {
    id: 'quotes',
    to: '/quotes',
    label: 'Cotações',
    icon: /* html */ `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    `
  },
  {
    id: 'history',
    to: '/history',
    label: 'Histórico',
    icon: /* html */ `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    `
  },
  {
    id: 'categories',
    to: '/categories',
    label: 'Categorias',
    icon: /* html */ `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    `,
    adminOnly: true
  }
]
