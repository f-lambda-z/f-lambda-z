import axios from "axios";
import millify from "millify";
import fs from "fs";

const keyword = "Buat program untuk menentukan apakah suatu nilai yang dimasukkan adalah angka positif, angka negatif, atau angka 0. hasil yang dicetak adalah: - “anda memasukkan angka positif”, “anda memasukkan angka negatif”, dan “anda memasukkan angka 0”​";
const readmeFile = "README.md";

function formatDate(created: string): string {
  const date = new Date(created);
  const formatMonth: { [key: string]: string } = {
    "00": "Januari",
    "01": "Februari",
    "02": "Maret",
    "03": "April",
    "04": "Mei",
    "05": "Juni",
    "06": "Juli",
    "07": "Agustus",
    "08": "September",
    "09": "Oktober",
    "10": "November",
    "11": "Desember",
  };

  const month = formatMonth[date.getMonth().toString().padStart(2, "0")];
  const dateFormat = `${date.getDate()} ${month} ${date.getFullYear()}`;

  return dateFormat;
}

function formatNumber(number: number): string {
  const unit = ["", "RB", "JT", "M", "T"];

  let i = 0;
  while (number >= 1000) {
    number /= 1000;
    i++;
  }

  return `${millify(number, { precision: 1 }).replace(".", ",")}${unit[i]}`;
}

const query = `
  query SearchQuestions($query: String!) {
    questions: questionSearch(query: $query) {
      edges {
        node {
          answers {
            nodes {
              author {
                nick
                avatar {
                  url
                  thumbnailUrl
                }
                databaseId
                friends {
                  count
                }
                rank {
                  name
                }
                specialRanks {
                  name
                }
                receivedThanks
                points
                created
                bestAnswersCount
                helpedUsersCount
                description
                answers {
                  count
                }
                questions {
                  count
                }
                answeringStreak {
                  pointsForToday
                  pointsForTomorrow
                  progressIncreasedToday
                  progress
                  canLotteryPointsBeClaimed
                }
                bestAnswersCountInLast30Days
                lastActive
                grade {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

const token = process.env.BR_TOKEN;
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`,
};

axios.post("https://brainly.co.id/graphql/id", { query, variables: { query: keyword } }, { headers })
  .then(response => {
    const data = response.data;
    if (data.data.questions.edges.length > 0) {
      const edge = data.data.questions.edges[0];
      const question = edge.node;

      if (question.answers.nodes.length > 0) {
        const answer = question.answers.nodes[0];
        if (answer.author.databaseId !== 58027659) {
          return;
        }

        const point = answer.author.points.toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const rank = encodeURIComponent(answer.author.rank.name);
        const created = encodeURIComponent(formatDate(answer.author.created));
        const friend = formatNumber(answer.author.friends.count);
        const thank = formatNumber(answer.author.receivedThanks);
        const totalAnswer = formatNumber(answer.author.answers.count);
        const totalQuestion = formatNumber(answer.author.questions.count);
        const bestAnswer = formatNumber(answer.author.bestAnswersCount);
        const bestAnswer30Day = formatNumber(answer.author.bestAnswersCountInLast30Days);
        const grade = encodeURIComponent(answer.author.grade.name);
        const helpedUser = formatNumber(answer.author.helpedUsersCount);
        const newYear = new Date().getFullYear();

        const readmeContent = `<h1 align="center">FΛZ</h1>

Statistik di Brainly.co.id

<table>
  <tr>
    <td><b>Username&nbsp;&nbsp;&nbsp;</b></td>
    <td>${answer.author.nick}</td>
  </tr>
  <tr>
    <td><b>User ID</b></td>
    <td><code>${answer.author.databaseId}</code></td>
  </tr>
  <tr>
    <td><b>Point</b></td>
    <td><img src="https://custom-icon-badges.demolab.com/badge/-${point}-8aadf4?labelColor=302d41&logo=point&logoColor=d9e0ee&style=for-the-badge" alt="Point"/></td>
  </tr>
  <tr>
    <td><b>Rank</b></td>
    <td><img src="https://custom-icon-badges.demolab.com/badge/-${rank}-f4dbd6?labelColor=302d41&logo=trophy&logoColor=d9e0ee&style=for-the-badge" alt="Rank"/></td>
  </tr>
  <tr>
    <td><b>Bergabung</b></td>
    <td><img src="https://custom-icon-badges.demolab.com/badge/-${created}-494d64?labelColor=302d41&logo=clock&logoColor=d9e0ee&style=for-the-badge" alt="Bergabung"/></td>
  </tr>
  <tr>
    <td><b>Teman</b></td>
    <td><img src="https://custom-icon-badges.demolab.com/badge/-${friend}-8bd5ca?labelColor=302d41&logo=user-group&logoColor=d9e0ee&style=for-the-badge" alt="Teman"/></td>
  </tr>
  <tr>
    <td><b>Terima kasih</b></td>
    <td><img src="https://custom-icon-badges.demolab.com/badge/-${thank}-ed8796?labelColor=302d41&logo=love&logoColor=d9e0ee&style=for-the-badge" alt="Terima kasih"/></td>
  </tr>
  <tr>
    <td><b>Jumlah jawaban</b></td>
    <td><img src="https://custom-icon-badges.demolab.com/badge/-${totalAnswer}-a6da95?labelColor=302d41&logo=answer&logoColor=d9e0ee&style=for-the-badge" alt="Jumlah jawaban"/></td>
  </tr>
  <tr>
    <td><b>Jumlah pertanyaan</b></td>
    <td><img src="https://custom-icon-badges.demolab.com/badge/-${totalQuestion}-7dc4e4?labelColor=302d41&logo=question&logoColor=d9e0ee&style=for-the-badge" alt="Jumlah pertanyaan"/></td>
  </tr>
  <tr>
    <td><b>Jumlah jawaban tercerdas</b></td>
    <td><img src="https://custom-icon-badges.demolab.com/badge/-${bestAnswer}-eed49f?labelColor=302d41&logo=brilliant&logoColor=d9e0ee&style=for-the-badge" alt="Jumlah jawaban tercerdas"/></td>
  </tr>
  <tr>
    <td><b>Jumlah jawaban tercerdas (30 hari terakhir)</b></td>
    <td><img src="https://custom-icon-badges.demolab.com/badge/-${bestAnswer30Day}-b7bdf8?labelColor=302d41&logo=brilliant&logoColor=d9e0ee&style=for-the-badge" alt="Jumlah jawaban tercerdas"/></td>
  </tr>
  <tr>
    <td><b>Tingkat</b></td>
    <td><img src="https://custom-icon-badges.demolab.com/badge/-${grade}-c6a0f6?labelColor=302d41&logo=graduation-outline&logoColor=d9e0ee&style=for-the-badge" alt="Tingkat"/></td>
  </tr>
  <tr>
    <td><b>User terbantu</b></td>
    <td><img src="https://custom-icon-badges.demolab.com/badge/-${helpedUser}-f5bde6?labelColor=302d41&logo=user&logoColor=d9e0ee&style=for-the-badge" alt="User terbantu"/></td>
  </tr>
</table>

Bahasa pemrograman yang sering digunakan:

![Bahasa Pemrograman](https://github-readme-stats.vercel.app/api/top-langs?username=fazbrainly&locale=id&title_color=8bd5ca&text_color=cad3f5&icon_color=c6a0f6&bg_color=24273a&langs_count=20&layout=donut-vertical&hide_border=false)

Donasi:

[![Trakteer](https://custom-icon-badges.demolab.com/badge/Trakteer-Donasi-ed8796?labelColor=302d41&logo=trakteerid&logoColor=d9e0ee&style=for-the-badge)](https://trakteer.id/fazbrainly)

---

<p align="center">Copyright © ${newYear} FΛZ</p>`;
        fs.writeFileSync(readmeFile, readmeContent);
      }
    }
  })
  .catch(error => console.error("Pesan error:", error.message));
