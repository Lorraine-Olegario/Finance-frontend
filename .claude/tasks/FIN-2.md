# TAREFA: Criar a branch **FIN-2**

## Correção de Dados do Dashboard

Foi identificado um problema na origem das informações exibidas no dashboard, especificamente nos componentes:

* Quadro **Categorias Principais**
* Gráfico **Categorias Principais**

## Problema

Atualmente a contagem está sendo realizada considerando todos os ativos cadastrados no sistema.

Esse comportamento está incorreto, pois os indicadores devem refletir exclusivamente os ativos presentes na carteira do usuário logado.

## Comportamento Esperado

As informações exibidas no quadro e no gráfico devem ser calculadas utilizando apenas os ativos vinculados à carteira do usuário.

### Exemplo

Se existirem:

* 1.000 ativos cadastrados na plataforma;
* Usuário possuir apenas 5 ativos em sua carteira;

O dashboard deverá considerar apenas esses 5 ativos para composição das categorias e indicadores.

## Ajustes Necessários

* Revisar a origem dos dados do quadro **Categorias Principais**.
* Revisar a origem dos dados do gráfico **Categorias Principais**.
* Garantir que todas as consultas sejam filtradas pelo usuário autenticado.
* Validar se os percentuais e totais apresentados são calculados com base apenas na carteira do usuário.
* Garantir consistência entre os valores exibidos no quadro e no gráfico.

## Critérios de Aceite

* O quadro **Categorias Principais** exibe somente dados da carteira do usuário.
* O gráfico **Categorias Principais** exibe somente dados da carteira do usuário.
* Os totais e percentuais são calculados corretamente.
* Não são considerados ativos que não pertençam à carteira do usuário.
* Os dados do quadro e do gráfico apresentam resultados consistentes entre si.
