<template>
  <!-- Atoms group header -->
  <div class="ds-group-header">
    <span class="ds-group-pill ds-group-pill--atoms">Atoms</span>
    <p>
      Unidades indivisíveis — não dependem de outros componentes do projeto.
    </p>
  </div>

  <!-- SvgIcon -->
  <section
    id="svg-icon"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">SvgIcon</h1>
      <p class="ds-section-desc">
        Renderiza ícones do registro
        <code>src/assets/icons/index.js</code>
        . Todos os ícones usam
        <code>viewBox="0 0 24 24"</code>
        ,
        <code>fill="none"</code>
        e
        <code>stroke="currentColor"</code>
        .
      </p>
    </div>
    <h3 class="ds-subsection-title">Ícones disponíveis</h3>
    <div class="ds-showcase ds-showcase--row">
      <div
        v-for="name in iconGallery"
        :key="name"
        class="ds-showcase-item"
      >
        <SvgIcon
          :name="name"
          size="22"
        />
        <span class="ds-showcase-caption">{{ name }}</span>
      </div>
    </div>
    <h3 class="ds-subsection-title">Tamanhos e espessura</h3>
    <div
      class="ds-showcase ds-showcase--row"
      style="align-items: flex-end"
    >
      <div class="ds-showcase-item">
        <SvgIcon
          name="search"
          size="16"
        />
        <span class="ds-showcase-caption">16px</span>
      </div>
      <div class="ds-showcase-item">
        <SvgIcon
          name="search"
          size="20"
        />
        <span class="ds-showcase-caption">20px</span>
      </div>
      <div class="ds-showcase-item">
        <SvgIcon
          name="search"
          size="24"
        />
        <span class="ds-showcase-caption">24px (padrão)</span>
      </div>
      <div class="ds-showcase-item">
        <SvgIcon
          name="search"
          size="32"
        />
        <span class="ds-showcase-caption">32px</span>
      </div>
      <div class="ds-showcase-item">
        <SvgIcon
          name="search"
          size="24"
          :stroke-width="1"
        />
        <span class="ds-showcase-caption">sw=1</span>
      </div>
      <div class="ds-showcase-item">
        <SvgIcon
          name="search"
          size="24"
          :stroke-width="2"
        />
        <span class="ds-showcase-caption">sw=2</span>
      </div>
      <div class="ds-showcase-item">
        <SvgIcon
          name="search"
          size="24"
          :stroke-width="3"
        />
        <span class="ds-showcase-caption">sw=3</span>
      </div>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>name</code>
      String (required) ·
      <code>size</code>
      String|Number (default
      <code>24</code>
      ) ·
      <code>strokeWidth</code>
      String|Number (default
      <code>2</code>
      ) ·
      <code>label</code>
      String (aria)
      <br />
      <b>Registro:</b>
      <code>src/assets/icons/index.js</code>
      — adicione novos ícones lá
    </div>
  </section>

  <!-- AppSpinner -->
  <section
    id="app-spinner"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">AppSpinner</h1>
      <p class="ds-section-desc">
        Spinner inline para usar dentro de botões e áreas de conteúdo. Use
        <code>LoadingSpinner</code>
        para loading de página inteira.
      </p>
    </div>
    <h3 class="ds-subsection-title">Tamanhos</h3>
    <div class="ds-showcase ds-showcase--row">
      <div class="ds-showcase-item">
        <AppSpinner size="16px" />
        <span class="ds-showcase-caption">16px</span>
      </div>
      <div class="ds-showcase-item">
        <AppSpinner size="20px" />
        <span class="ds-showcase-caption">20px (padrão)</span>
      </div>
      <div class="ds-showcase-item">
        <AppSpinner size="32px" />
        <span class="ds-showcase-caption">32px</span>
      </div>
      <div class="ds-showcase-item">
        <AppSpinner size="48px" />
        <span class="ds-showcase-caption">48px</span>
      </div>
    </div>
    <h3 class="ds-subsection-title">Invertido (fundo escuro)</h3>
    <div class="ds-showcase ds-showcase--dark ds-showcase--row">
      <AppSpinner
        size="24px"
        inverted
      />
      <span style="color: white; font-size: 0.875rem">inverted</span>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>size</code>
      String (default
      <code>'20px'</code>
      ) ·
      <code>inverted</code>
      Boolean ·
      <code>label</code>
      String (aria)
    </div>
  </section>

  <!-- BaseButton -->
  <section
    id="base-button"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">BaseButton</h1>
      <p class="ds-section-desc">
        Botão com 4 variantes e 3 tamanhos. Inclui loading state com
        <code>AppSpinner</code>
        integrado.
      </p>
    </div>
    <h3 class="ds-subsection-title">Variantes</h3>
    <div class="ds-showcase ds-showcase--row">
      <BaseButton variant="primary">Primary</BaseButton>
      <BaseButton variant="secondary">Secondary</BaseButton>
      <BaseButton variant="ghost">Ghost</BaseButton>
      <BaseButton variant="danger">Danger</BaseButton>
    </div>
    <h3 class="ds-subsection-title">Tamanhos</h3>
    <div
      class="ds-showcase ds-showcase--row"
      style="align-items: flex-end"
    >
      <BaseButton
        variant="primary"
        size="sm"
      >
        Small
      </BaseButton>
      <BaseButton
        variant="primary"
        size="md"
      >
        Medium
      </BaseButton>
      <BaseButton
        variant="primary"
        size="lg"
      >
        Large
      </BaseButton>
    </div>
    <h3 class="ds-subsection-title">Estados</h3>
    <div class="ds-showcase ds-showcase--row">
      <BaseButton
        variant="primary"
        :loading="true"
      >
        Salvando
      </BaseButton>
      <BaseButton
        variant="secondary"
        :loading="true"
      >
        Carregando
      </BaseButton>
      <BaseButton
        variant="primary"
        :disabled="true"
      >
        Disabled
      </BaseButton>
      <BaseButton
        variant="danger"
        :disabled="true"
      >
        Disabled
      </BaseButton>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>variant</code>
      primary|secondary|ghost|danger ·
      <code>size</code>
      sm|md|lg ·
      <code>loading</code>
      Boolean ·
      <code>disabled</code>
      Boolean ·
      <code>type</code>
      String
      <br />
      <b>Slots:</b>
      <code>default</code>
      ·
      <code>#icon-left</code>
      ·
      <code>#icon-right</code>
    </div>
  </section>

  <!-- BaseInput -->
  <section
    id="base-input"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">BaseInput</h1>
      <p class="ds-section-desc">
        Input base com v-model. Estilos de foco, disabled e readonly via CSS
        variables.
      </p>
    </div>
    <div
      class="ds-showcase ds-showcase--col"
      style="max-width: 360px"
    >
      <BaseInput
        v-model="demoInput"
        placeholder="Placeholder padrão"
      />
      <BaseInput
        v-model="demoInput"
        :disabled="true"
        placeholder="Disabled"
      />
      <BaseInput
        v-model="demoInput"
        :readonly="true"
      />
      <BaseInput
        v-model="demoInput"
        type="password"
        placeholder="Password"
      />
      <BaseInput
        v-model="demoInput"
        type="number"
        placeholder="Número"
      />
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>modelValue</code>
      ·
      <code>type</code>
      text|email|password|number|search|color ·
      <code>placeholder</code>
      ·
      <code>disabled</code>
      ·
      <code>readonly</code>
      ·
      <code>required</code>
      <br />
      <b>Emits:</b>
      <code>update:modelValue</code>
      ·
      <code>blur</code>
      ·
      <code>focus</code>
    </div>
  </section>

  <!-- BaseSelect -->
  <section
    id="base-select"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">BaseSelect</h1>
      <p class="ds-section-desc">
        Select com array de opções
        <code>[{value, label}]</code>
        e placeholder opcional.
      </p>
    </div>
    <div
      class="ds-showcase ds-showcase--col"
      style="max-width: 360px"
    >
      <BaseSelect
        v-model="demoSelect"
        :options="selectOpts"
        placeholder="Selecione uma categoria"
      />
      <BaseSelect
        v-model="demoSelect"
        :options="selectOpts"
        :disabled="true"
        placeholder="Disabled"
      />
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>modelValue</code>
      ·
      <code>options</code>
      Array&lt;{value, label}&gt; ·
      <code>placeholder</code>
      ·
      <code>disabled</code>
      ·
      <code>required</code>
      <br />
      <b>Emits:</b>
      <code>update:modelValue</code>
    </div>
  </section>

  <!-- Badge -->
  <section
    id="badge"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">Badge</h1>
      <p class="ds-section-desc">
        Badge de categoria com mapa de cores built-in.
      </p>
    </div>
    <h3 class="ds-subsection-title">Categorias padrão</h3>
    <div class="ds-showcase ds-showcase--row">
      <Badge label="Ações" />
      <Badge label="FII" />
      <Badge label="BDR" />
      <Badge label="ETF" />
      <Badge label="Cripto" />
      <Badge label="Renda Fixa" />
    </div>
    <h3 class="ds-subsection-title">Cor customizada</h3>
    <div class="ds-showcase ds-showcase--row">
      <Badge
        label="Custom"
        color="#004e89"
      />
      <Badge
        label="Custom"
        color="#06b6d4"
      />
      <Badge
        label="Custom"
        color="#ec4899"
      />
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>label</code>
      String (required) ·
      <code>color</code>
      String (hex override)
    </div>
  </section>

  <!-- StatusBadge -->
  <section
    id="status-badge"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">StatusBadge</h1>
      <p class="ds-section-desc">
        Badge de status de ativo. Cores definidas no style-guide —
        exclusivamente para estado de ativos.
      </p>
    </div>
    <div class="ds-showcase ds-showcase--row">
      <div class="ds-showcase-item">
        <StatusBadge status="ativo" />
        <span class="ds-showcase-caption">ativo</span>
      </div>
      <div class="ds-showcase-item">
        <StatusBadge status="observando" />
        <span class="ds-showcase-caption">observando</span>
      </div>
      <div class="ds-showcase-item">
        <StatusBadge status="inativo" />
        <span class="ds-showcase-caption">inativo</span>
      </div>
      <div class="ds-showcase-item">
        <StatusBadge status="pausado" />
        <span class="ds-showcase-caption">pausado</span>
      </div>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>status</code>
      'ativo' | 'observando' | 'inativo' | 'pausado' (required)
    </div>
  </section>

  <!-- ActionButton -->
  <section
    id="action-button"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">ActionButton</h1>
      <p class="ds-section-desc">
        Botão quadrado 36×36px para ícones de ação em tabelas. Use
        <code>SvgIcon</code>
        no slot.
      </p>
    </div>
    <h3 class="ds-subsection-title">Variantes (hover para ver)</h3>
    <div class="ds-showcase ds-showcase--row">
      <div
        v-for="v in actionVariants"
        :key="v.name"
        class="ds-showcase-item"
      >
        <ActionButton
          :variant="v.name"
          :title="v.label"
        >
          <SvgIcon
            :name="v.icon"
            size="18"
          />
        </ActionButton>
        <span class="ds-showcase-caption">{{ v.name }}</span>
      </div>
    </div>
    <h3 class="ds-subsection-title">Disabled</h3>
    <div class="ds-showcase ds-showcase--row">
      <ActionButton
        variant="edit"
        :disabled="true"
        title="Editar"
      >
        <SvgIcon
          name="edit"
          size="18"
        />
      </ActionButton>
      <ActionButton
        variant="delete"
        :disabled="true"
        title="Excluir"
      >
        <SvgIcon
          name="trash"
          size="18"
        />
      </ActionButton>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>variant</code>
      default|edit|delete|play|pause|observe|info ·
      <code>title</code>
      String ·
      <code>disabled</code>
      Boolean
      <br />
      <b>Slots:</b>
      <code>default</code>
      (use
      <code>SvgIcon</code>
      )
    </div>
  </section>

  <!-- FilterLabel -->
  <section
    id="filter-label"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">FilterLabel</h1>
      <p class="ds-section-desc">Wrapper de label para campos de filtro.</p>
    </div>
    <div
      class="ds-showcase ds-showcase--col"
      style="max-width: 260px"
    >
      <FilterLabel
        label="Categoria"
        for-id="cat-demo"
      >
        <template #icon>
          <SvgIcon
            name="filter"
            size="14"
          />
        </template>
        <BaseSelect
          v-model="demoSelect"
          :options="selectOpts"
        />
      </FilterLabel>
      <FilterLabel
        label="Nome"
        for-id="nome-demo"
      >
        <BaseInput
          v-model="demoInput"
          placeholder="Buscar..."
        />
      </FilterLabel>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>label</code>
      String (required) ·
      <code>forId</code>
      String
      <br />
      <b>Slots:</b>
      <code>#icon</code>
      ·
      <code>default</code>
      (campo)
    </div>
  </section>

  <!-- LoadingSpinner -->
  <section
    id="loading-spinner"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">LoadingSpinner</h1>
      <p class="ds-section-desc">Spinner de carregamento de seção ou página.</p>
    </div>
    <div
      class="ds-showcase ds-showcase--row"
      style="align-items: flex-start"
    >
      <LoadingSpinner
        message=""
        size="32px"
      />
      <LoadingSpinner
        size="48px"
        message="Carregando dados..."
      />
      <LoadingSpinner
        size="64px"
        message="Aguarde..."
      />
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>message</code>
      String (default 'Carregando...') ·
      <code>size</code>
      String (default '48px') ·
      <code>fullscreen</code>
      Boolean
    </div>
  </section>

  <!-- EmptyState -->
  <section
    id="empty-state"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">EmptyState</h1>
      <p class="ds-section-desc">Estado vazio com slots de ícone e ação.</p>
    </div>
    <h3 class="ds-subsection-title">Padrão</h3>
    <div class="ds-showcase">
      <EmptyState
        title="Nenhum ativo encontrado"
        description="Adicione ativos para começar a acompanhar sua carteira."
      />
    </div>
    <h3 class="ds-subsection-title">Com ícone e ação customizados</h3>
    <div class="ds-showcase">
      <EmptyState
        title="Sem alertas ativos"
        description="Configure alertas para ser notificado sobre variações de preço."
      >
        <template #icon>
          <SvgIcon
            name="bell"
            size="64"
            :stroke-width="1.5"
            style="color: var(--accent-blue); opacity: 0.6"
          />
        </template>
        <template #action>
          <BaseButton variant="primary">Criar alerta</BaseButton>
        </template>
      </EmptyState>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>title</code>
      String (required) ·
      <code>description</code>
      String (required)
      <br />
      <b>Slots:</b>
      <code>#icon</code>
      ·
      <code>#action</code>
    </div>
  </section>

  <!-- AlertMessage -->
  <section
    id="alert-message"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">AlertMessage</h1>
      <p class="ds-section-desc">
        Alert contextual com 4 tipos. Suporta título opcional e dismiss.
      </p>
    </div>
    <div class="ds-showcase ds-showcase--col">
      <AlertMessage
        type="error"
        message="Não foi possível salvar. Verifique os campos e tente novamente."
      />
      <AlertMessage
        type="warning"
        title="Atenção"
        message="Este ativo está com cotação desatualizada há mais de 24h."
      />
      <AlertMessage
        type="success"
        title="Salvo!"
        message="As informações do ativo foram atualizadas."
      />
      <AlertMessage
        type="info"
        message="Os dados são atualizados automaticamente a cada 15 minutos."
      />
      <AlertMessage
        type="error"
        message="Erro dismissível."
        :dismissible="true"
      />
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>type</code>
      error|warning|success|info ·
      <code>title</code>
      String ·
      <code>message</code>
      String (required) ·
      <code>dismissible</code>
      Boolean
      <br />
      <b>Emits:</b>
      <code>dismiss</code>
    </div>
  </section>

  <!-- Pagination -->
  <section
    id="pagination"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">Pagination</h1>
      <p class="ds-section-desc">
        Paginação com cálculo automático de páginas visíveis e ellipsis.
      </p>
    </div>
    <div class="ds-showcase ds-showcase--col">
      <div>
        <p class="ds-preview-label">Poucas páginas</p>
        <Pagination
          :current-page="2"
          :last-page="5"
          :total="47"
        />
      </div>
      <div>
        <p class="ds-preview-label">Muitas páginas (ellipsis)</p>
        <Pagination
          :current-page="6"
          :last-page="20"
          :total="389"
        />
      </div>
      <div>
        <p class="ds-preview-label">Com info de página</p>
        <Pagination
          :current-page="3"
          :last-page="8"
          :total="75"
          :show-page-info="true"
        />
      </div>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>currentPage</code>
      ·
      <code>lastPage</code>
      ·
      <code>total</code>
      ·
      <code>perPage</code>
      (10) ·
      <code>maxVisiblePages</code>
      (5) ·
      <code>showTotal</code>
      (true) ·
      <code>showPageInfo</code>
      (false)
      <br />
      <b>Emits:</b>
      <code>page-change</code>
      (page: Number) ·
      <b>Slots:</b>
      <code>#totalLabel</code>
    </div>
  </section>

  <!-- StatCard -->
  <section
    id="stat-card"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">StatCard</h1>
      <p class="ds-section-desc">
        Card de métrica com barra lateral colorida. 4 variantes.
      </p>
    </div>
    <div class="ds-showcase ds-stat-grid">
      <StatCard
        label="Total investido"
        value="R$ 48.250"
        subtitle="+ R$ 1.200 este mês"
        variant="primary"
        :is-positive="true"
      >
        <template #icon>
          <SvgIcon name="dollar" />
        </template>
        <template #subtitle-icon>
          <SvgIcon
            name="chevron-up"
            size="16"
          />
        </template>
      </StatCard>
      <StatCard
        label="Ativos"
        value="23"
        subtitle="3 categorias"
        variant="success"
      >
        <template #icon>
          <SvgIcon name="activity" />
        </template>
      </StatCard>
      <StatCard
        label="Observando"
        value="7"
        subtitle="2 com alerta"
        variant="info"
      >
        <template #icon>
          <SvgIcon name="eye" />
        </template>
      </StatCard>
      <StatCard
        label="Rentabilidade"
        value="+12,4%"
        subtitle="últimos 30 dias"
        variant="warning"
      >
        <template #icon>
          <SvgIcon name="trending-up" />
        </template>
      </StatCard>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>label</code>
      ·
      <code>value</code>
      ·
      <code>subtitle</code>
      ·
      <code>variant</code>
      primary|success|info|warning ·
      <code>isPositive</code>
      Boolean
      <br />
      <b>Slots:</b>
      <code>#icon</code>
      ·
      <code>#subtitle-icon</code>
    </div>
  </section>

  <!-- DashboardCard -->
  <section
    id="dashboard-card"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">DashboardCard</h1>
      <p class="ds-section-desc">
        Container genérico para seções do dashboard.
      </p>
    </div>
    <div class="ds-showcase">
      <DashboardCard title="Distribuição por Categoria">
        <template #icon>
          <SvgIcon name="pie-chart" />
        </template>
        <template #actions>
          <BaseButton
            variant="ghost"
            size="sm"
          >
            Ver tudo
          </BaseButton>
        </template>
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
          <CategoryListItem
            name="Ações"
            :count="12"
            percentage="52"
            color="#3b82f6"
          />
          <CategoryListItem
            name="FII"
            :count="5"
            percentage="22"
            color="#10b981"
          />
          <CategoryListItem
            name="Cripto"
            :count="3"
            percentage="13"
            color="#ec4899"
          />
          <CategoryListItem
            name="BDR"
            :count="3"
            percentage="13"
            color="#8b5cf6"
          />
        </div>
      </DashboardCard>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>title</code>
      String (required)
      <br />
      <b>Slots:</b>
      <code>#icon</code>
      ·
      <code>#actions</code>
      ·
      <code>default</code>
    </div>
  </section>

  <!-- QuickActionCard -->
  <section
    id="quick-action-card"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">QuickActionCard</h1>
      <p class="ds-section-desc">
        Card de navegação rápida — renderiza um
        <code>&lt;RouterLink&gt;</code>
        .
      </p>
    </div>
    <div class="ds-showcase">
      <div
        style="
          display: grid;
          grid-template-columns: repeat(3, 180px);
          gap: 1rem;
        "
      >
        <QuickActionCard
          to="/my-assets"
          label="Meus Ativos"
        >
          <template #icon>
            <SvgIcon name="monitor" />
          </template>
        </QuickActionCard>
        <QuickActionCard
          to="/observed"
          label="Observando"
        >
          <template #icon>
            <SvgIcon name="eye" />
          </template>
        </QuickActionCard>
        <QuickActionCard
          to="/quotes"
          label="Cotações"
        >
          <template #icon>
            <SvgIcon name="trending-up-line" />
          </template>
        </QuickActionCard>
      </div>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>to</code>
      String (required) ·
      <code>label</code>
      String (required)
      <br />
      <b>Slots:</b>
      <code>#icon</code>
    </div>
  </section>

  <!-- CategoryListItem -->
  <section
    id="category-list-item"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">CategoryListItem</h1>
      <p class="ds-section-desc">
        Linha de item de categoria com dot colorido, nome, contagem e
        percentual.
      </p>
    </div>
    <div
      class="ds-showcase"
      style="max-width: 400px"
    >
      <CategoryListItem
        name="Ações"
        :count="12"
        percentage="52"
        color="#3b82f6"
      />
      <CategoryListItem
        name="FII"
        :count="5"
        percentage="22"
        color="#10b981"
      />
      <CategoryListItem
        name="Cripto"
        :count="3"
        percentage="13"
        color="#ec4899"
      />
      <CategoryListItem
        name="BDR"
        :count="3"
        percentage="13"
        color="#8b5cf6"
      />
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>name</code>
      String ·
      <code>count</code>
      Number ·
      <code>percentage</code>
      Number|String ·
      <code>color</code>
      String hex
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

import AppSpinner from '@/components/atoms/AppSpinner.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseSelect from '@/components/atoms/BaseSelect.vue'
import Badge from '@/components/atoms/Badge.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import ActionButton from '@/components/atoms/ActionButton.vue'
import FilterLabel from '@/components/atoms/FilterLabel.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import EmptyState from '@/components/atoms/EmptyState.vue'
import AlertMessage from '@/components/atoms/AlertMessage.vue'
import Pagination from '@/components/atoms/Pagination.vue'
import StatCard from '@/components/atoms/StatCard.vue'
import DashboardCard from '@/components/atoms/DashboardCard.vue'
import QuickActionCard from '@/components/atoms/QuickActionCard.vue'
import CategoryListItem from '@/components/atoms/CategoryListItem.vue'
import SvgIcon from '@/components/atoms/SvgIcon.vue'

const demoInput = ref('Valor editável')
const demoSelect = ref('')

const selectOpts = [
  { value: 'acoes', label: 'Ações' },
  { value: 'fii', label: 'FII' },
  { value: 'bdr', label: 'BDR' },
  { value: 'cripto', label: 'Cripto' }
]

const actionVariants = [
  { name: 'default', label: 'Default', icon: 'more-horizontal' },
  { name: 'edit', label: 'Edit', icon: 'edit' },
  { name: 'delete', label: 'Delete', icon: 'trash' },
  { name: 'play', label: 'Play', icon: 'play' },
  { name: 'pause', label: 'Pause', icon: 'pause' },
  { name: 'observe', label: 'Observe', icon: 'eye' },
  { name: 'info', label: 'Info', icon: 'info' }
]

const iconGallery = [
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'chevron-down',
  'search',
  'close',
  'edit',
  'trash',
  'play',
  'pause',
  'plus',
  'filter',
  'info',
  'alert-circle',
  'check-circle',
  'x-circle',
  'alert-triangle',
  'more-horizontal',
  'eye',
  'eye-off',
  'bell',
  'dollar',
  'activity',
  'trending-up',
  'trending-up-line',
  'trending-down',
  'pie-chart',
  'bar-chart',
  'monitor',
  'grid',
  'logo-grid',
  'users',
  'user',
  'calendar',
  'settings',
  'logout',
  'download',
  'upload'
]
</script>
