**TAREFA:** Criar a branch **FIN-1**

Implementar a funcionalidade de ocultação de informações financeiras na interface através de um botão de visualização ao lado do usuário.

### Objetivo

Permitir que o usuário oculte ou exiba valores financeiros da plataforma de forma rápida, preservando a privacidade durante compartilhamento de tela, apresentações ou uso em ambientes públicos.

### Requisitos

* Adicionar um ícone de visualização ("olho") ao lado das informações do usuário no cabeçalho da aplicação.
* Ao clicar no ícone:

  * Exibir os valores financeiros quando estiver habilitado.
  * Ocultar os valores financeiros quando estiver desabilitado.
* A preferência deve ser mantida durante a navegação da aplicação.
* O estado selecionado deve ser aplicado em todas as telas que exibem informações financeiras.

### Escopo

A ocultação deve ser aplicada a todos os componentes que exibam valores monetários, incluindo, mas não se limitando a:

* Saldo disponível;
* Saldo bloqueado;
* Faturamento;
* Comissões;
* Saques;
* Extratos;
* Dashboards;
* Relatórios;
* Cards de indicadores financeiros;
* Demais informações financeiras da plataforma.

### Comportamento Esperado

Quando ocultos, os valores devem ser substituídos por uma máscara visual, por exemplo:

```text
R$ ••••••
```

ou

```text
********
```

Ao reativar a visualização, os valores reais devem ser exibidos novamente.

### Critérios de Aceite

* Existe um botão de visualização ao lado do usuário no cabeçalho.
* O usuário consegue ocultar e exibir informações financeiras com um único clique.
* Todos os valores financeiros da plataforma respeitam a configuração selecionada.
* A preferência permanece ativa durante a navegação da aplicação.
* Não ocorre impacto nas regras de negócio ou cálculos financeiros.
