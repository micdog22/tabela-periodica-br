# Tabela Periódica

Tabela periódica interativa em português do Brasil com os 118 elementos: massa atômica oficial da IUPAC, categoria, estado físico a 25 °C, configuração eletrônica com as exceções reais à regra de Madelung, busca sem acentos, filtros e um quiz para decorar os símbolos.

**Acesse online:** https://micdog22.github.io/tabela-periodica-br/

## Recursos

- **Os 118 elementos** com nomes oficiais em português (Nitrogênio, Fósforo, Tungstênio, Nióbio, Criptônio, Xenônio, Radônio, Nihônio, Fleróvio, Moscóvio, Livermório, Tenesso e Oganessônio).
- **Massa atômica** padrão abreviada da IUPAC (CIAAW, 2024) e, para os elementos sem peso padrão, o número de massa do isótopo mais estável entre colchetes, com a meia-vida.
- **Categorias** com cores e legenda: metais alcalinos e alcalinoterrosos, metais de transição, lantanídeos, actinídeos, metais pós-transição, semimetais, não metais, halogênios e gases nobres.
- **Período, grupo e estado físico** a 25 °C (só o bromo e o mercúrio são líquidos).
- **Configuração eletrônica** abreviada, a distribuição completa em ordem de energia (diagrama de Linus Pauling) e os elétrons por camada (K, L, M, N, O, P, Q).
- **Exceções destacadas:** Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, La, Ce, Gd, Pt, Au, Ac, Th, Pa, U, Np, Cm e Lr mostram a configuração real e a que o diagrama preveria.
- **Busca** por nome, símbolo ou número, sem diferenciar acentos e maiúsculas ("nitrogenio", "FE", "79").
- **Filtros** por categoria (também clicando na legenda) e por estado físico.
- **Quiz do símbolo:** ver o nome e escolher o símbolo, ou o contrário, com alternativas parecidas, placar e recorde salvo no navegador.
- Layout clássico com as séries dos lantanídeos e actinídeos embaixo, tema claro e escuro, navegação pelas setas e link direto para cada elemento (`#26` abre o ferro).

## Como usar

- Clique em um elemento para ver os detalhes, ou use as setas do teclado e Enter.
- Digite na busca e tecle Enter para abrir o primeiro resultado; Esc limpa.
- Clique numa categoria da legenda para destacar só ela; clique de novo para voltar.
- No quiz, use as teclas de 1 a 4 para responder.

## Como rodar localmente

Não há build nem dependências. Sirva a pasta por HTTP:

```bash
python3 -m http.server 8000
```

E abra http://localhost:8000.

## Testes

```bash
npm test
```

(ou `node --test`, com Node 18 ou mais novo). Os testes conferem: 118 elementos numerados de 1 a 118, símbolos únicos, nomes em português, posições iguais às da tabela padrão (período e grupo calculados à parte, sem olhar os dados), categorias válidas e coerentes com os grupos (gases nobres no grupo 18, halogênios no 17), os líquidos e gases a 25 °C, valores de massa atômica conhecidos e as quatro inversões clássicas (Ar e K, Co e Ni, Te e I, Th e Pa), que a soma de elétrons de cada configuração é igual ao número atômico, a lista exata de exceções à regra de Madelung, a distribuição por camadas, a busca sem acentos, os filtros e o quiz.

## Como funciona

### De onde vêm os dados

- **Massa atômica:** a Comissão de Abundâncias Isotópicas e Pesos Atômicos (CIAAW) da IUPAC publica os pesos atômicos padrão abreviados, com até cinco algarismos significativos. Alguns aparecem com menos casas porque a composição isotópica varia na natureza: o lítio é 6,94 e o chumbo, 207,2.
- **Elementos radioativos sem peso padrão:** mostram, entre colchetes, o número de massa do isótopo de maior meia-vida conhecido segundo a CIAAW, que se baseia na avaliação NUBASE2020. O tecnécio, por exemplo, aparece como [97], com meia-vida de 4,21 milhões de anos; o Tc-98 tem 4,2 milhões de anos e a CIAAW lista os dois.
- **Configuração eletrônica:** estado fundamental do átomo neutro isolado, como nas tabelas de espectroscopia. Do rutherfórdio (104) em diante, só existem previsões teóricas, e a ferramenta avisa.
- **Estado físico:** a 25 °C e 1 atm. Do férmio (100) em diante só foram produzidos alguns átomos por vez, então o estado não foi determinado.

### A regra de Madelung e o diagrama de Linus Pauling

Os elétrons ocupam os subníveis em ordem crescente de n + l (n é o número quântico principal e l vale 0, 1, 2 e 3 para s, p, d e f) e, no empate, primeiro o de menor n. Isso dá a sequência que o diagrama de Linus Pauling desenha em diagonais:

```
1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s 5f 6d 7p
```

Cada subnível comporta 2 (s), 6 (p), 10 (d) ou 14 (f) elétrons. O programa calcula a configuração prevista para cada número atômico e compara com a real. Quando são diferentes, o elemento é uma exceção. O caso mais famoso é o cromo: o diagrama prevê [Ar] 3d⁴ 4s², mas o real é [Ar] 3d⁵ 4s¹. Nos 118 elementos há exatamente 20 exceções; entre elas, o paládio ([Kr] 4d¹⁰, sem elétron na camada 5) e o laurêncio, cujo elétron externo vai para 7p em vez de 6d por efeitos relativísticos.

### Configuração abreviada e camadas

A forma abreviada troca o começo da configuração pelo gás nobre anterior: [Ar] vale 1s² 2s² 2p⁶ 3s² 3p⁶. Para contar os elétrons, o programa expande o núcleo e soma tudo, e um teste garante que a soma é igual ao número atômico nos 118 elementos. Somando os elétrons de cada n, saem as camadas K, L, M, N, O, P e Q: o ferro fica com 2, 8, 14 e 2.

### Busca sem acentos

O texto é normalizado na forma NFD do Unicode, que separa cada letra acentuada em letra mais acento; depois os acentos são removidos e tudo vira minúscula. Assim "Nitrogênio", "NITROGENIO" e "nitrogenio" ficam iguais. Os resultados vêm na ordem: número exato, símbolo exato, nome que começa com o texto, símbolo que começa com o texto e nome que contém o texto.

### Classificações que variam entre livros

Algumas categorias mudam de uma tabela para outra. Aqui o polônio é semimetal, como na maioria dos livros brasileiros; o astato e o tenesso ficam com os halogênios e o oganessônio com os gases nobres, pela posição na tabela, com uma observação no detalhe de cada um. Lantanídeos e actinídeos ficam sem número de grupo, nas duas linhas de baixo.

## Estrutura

```
index.html          página
styles.css          estilos (tema claro e escuro)
src/elements.js     dados dos 118 elementos e suas fontes
src/chem.js         configurações, regra de Madelung, camadas, busca e quiz
src/app.js          interface
tests/              testes com node:test
```

## Contribuindo

Issues e pull requests são bem-vindos. Achou algum valor diferente de uma fonte oficial? Abra uma issue com a referência.

## Licença

MIT. Veja [LICENSE](LICENSE).
