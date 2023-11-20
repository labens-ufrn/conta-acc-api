# Documento de Visão

Documento construído a partido do **Modelo BSI - Doc 001 - Documento de Visão** que pode ser encontrado no
link: https://docs.google.com/document/d/1DPBcyGHgflmz5RDsZQ2X8KVBPoEF5PdAz9BBNFyLa6A/edit?usp=sharing

### Matriz de Competências

| Membro  | Competências                                                                    |
| ------- | ------------------------------------------------------------------------------- |
| Taciano | Desenvolvedor Java, Junit, Eclipse, JSP, JSF, Hibernate, Matemática, Latex, etc |
| Sandra  | Gestão, Geográfa                                                                |
| Zé      | Desenvolvedor Java, Astrofísico                                                 |
| Maria   | Gestão, Desenvolvedor Java, Pesquisadora em Engenharia de Software              |

## Perfis dos Usuários

O sistema poderá ser utilizado por diversos usuários. Temos os seguintes perfis/atores:

| Perfil      | Descrição                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| Admin       | Este usuário realiza cadastro de dados dos cursos e cadastra o coordenador de horas.                                       |
| Coordinator | Este usuário consegue ter acesso a todos os dados dos alunos do curso, como principal as horas e os registros cadastrados. |
| User        | Este usuário é o aluno, na qual ele pode cadatrar as horas complementares e consultar o historico e o progresso            |

## Lista de Requisitos Funcionais

| Requisito                                         | Descrição                                                                                                        | Ator     |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------- |
| RF001 - Manter um cadastro de ursos               | O curso tem um nome e código                                                                                     | Sysadmin |
| RF002 - Manter o cadastro de coordenador do curso | Um coordenador é um usuário com email, senha e nome.                                                             | Sysadmin |
| RF003 - Manter o cadastro de coordenador de horas | Um coordenador de horas é um usuário com email, senha e nome. pertence.                                          | Admin    |
| RF004 - Manter cadastro de dados do cursos        | Um curso tem dados como nome e tem relacionamento com usuários, assim tendo uma lista de usuários.               | Admin    |
| RF005 - Manter cadastro de aluno                  | Os alunos poderam criar sua propria conta, selecionando o curso e com dados como nome, email, senha e matricula. | User     |

### Modelo Conceitual

Abaixo apresentamos o modelo conceitual usando o **YUML**.

![Modelo UML](yuml/monitoria-modelo.png)

O código que gera o diagrama está [Aqui!](yuml/monitoria-yuml.md). O detalhamento dos modelos conceitual e de dados do projeto estão no [Documento de Modelos](doc-modelos.md).

#### Descrição das Entidades

## Lista de Requisitos Não-Funcionais

| Requisito                                    | Descrição                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| RNF001 - Deve ser acessível via navegador    | Deve abrir perfeitamento no Firefox e no Chrome.                             |
| RNF002 - Consultas deve ser eficiente        | O sistema deve executar as consultas em milessegundos                        |
| RNF003 - Log e histórico de acesso e funções | Deve manter um log de todos os acessos e das funções executadas pelo usuário |

## Riscos

Tabela com o mapeamento dos riscos do projeto, as possíveis soluções e os responsáveis.

| Data       | Risco                                                                 | Prioridade | Responsável | Status    | Providência/Solução                                                                     |
| ---------- | --------------------------------------------------------------------- | ---------- | ----------- | --------- | --------------------------------------------------------------------------------------- |
| 10/03/2018 | Não aprendizado das ferramentas utilizadas pelos componentes do grupo | Alta       | Todos       | Vigente   | Reforçar estudos sobre as ferramentas e aulas com a integrante que conhece a ferramenta |
| 10/03/2018 | Ausência por qualquer motivo do cliente                               | Média      | Gerente     | Vigente   | Planejar o cronograma tendo em base a agenda do cliente                                 |
| 10/03/2018 | Divisão de tarefas mal sucedida                                       | Baixa      | Gerente     | Vigente   | Acompanhar de perto o desenvolvimento de cada membro da equipe                          |
| 10/03/2018 | Implementação de protótipo com as tecnologias                         | Alto       | Todos       | Resolvido | Encontrar tutorial com a maioria da tecnologia e implementar um caso base do sistema    |

### Referências
