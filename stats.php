<?php

$keyword = getenv("QUESTION");
$readme_file = "README.md";

function format_date($created) {
  $date = date_create($created);
  $date->setTimezone(new DateTimeZone('GMT+7'));
  $format_month = array(
    '01' => 'Januari',
    '02' => 'Februari',
    '03' => 'Maret',
    '04' => 'April',
    '05' => 'Mei',
    '06' => 'Juni',
    '07' => 'Juli',
    '08' => 'Agustus',
    '09' => 'September',
    '10' => 'Oktober',
    '11' => 'November',
    '12' => 'Desember',
  );

  $month = $format_month[date_format($date, 'm')];
  $date_format = round(date_format($date, 'd'), 0) . " " . $month . " " . date_format($date, 'Y');

  return $date_format;
}

function format_number($number) {
  $unit = array('', 'RB', 'JT', 'M', 'T');

  $i = 0;
  while ($number >= 1000) {
    $number /= 1000;
    $i++;
  }

  return str_replace(".", ",", round($number, 1)) . $unit[$i];
}

$query = <<<GRAPHQL
query SearchQuestions(\$query: String!) {
  questions: questionSearch(query: \$query) {
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
GRAPHQL;

$token = getenv("BR_TOKEN");
$headers = [
  "Content-Type: application/json",
  "Authorization: Bearer {$token}",
];

$url = "https://brainly.co.id/graphql/id";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["query" => $query, "variables" => ["query" => $keyword]]));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if (isset($data["data"]["questions"]["edges"])) {
  foreach ($data["data"]["questions"]["edges"] as $edge) {
    $question = $edge["node"];
    if (isset($question["answers"]["nodes"])) {
      foreach ($question["answers"]["nodes"] as $answer) {
        if ($answer["author"]["databaseId"] != getenv("USERID")) {
          continue;
        }

        $point = number_format($answer["author"]["points"], 0, ",", ".");
        $rank = rawurlencode($answer["author"]["rank"]["name"]);
        $created = rawurlencode(format_date($answer["author"]["created"]));
        $friend = format_number($answer["author"]["friends"]["count"]);
        $thank = format_number($answer["author"]["receivedThanks"]);
        $total_answer = format_number($answer["author"]["answers"]["count"]);
        $total_question = format_number($answer["author"]["questions"]["count"]);
        $best_answer = format_number($answer["author"]["bestAnswersCount"]);
        $best_answer_30_day = format_number($answer["author"]["bestAnswersCountInLast30Days"]);
        $grade = rawurlencode($answer["author"]["grade"]["name"]);
        $helped_user = format_number($answer["author"]["helpedUsersCount"]);
        $new_year = date("Y");

        $readme_content = "<h1 align=\"center\">FΛZ</h1>

Statistik di Brainly.co.id

<table>
  <tr>
    <td><b>Username&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></td>
    <td>{$answer['author']['nick']}</td>
  </tr>
  <tr>
    <td><b>User ID</b></td>
    <td><code>{$answer['author']['databaseId']}</code></td>
  </tr>
  <tr>
    <td><b>Point</b></td>
    <td><img src=\"https://custom-icon-badges.demolab.com/badge/-{$point}-8aadf4?labelColor=302d41&logo=point&logoColor=d9e0ee&style=for-the-badge\" alt=\"Point\"/></td>
  </tr>
  <tr>
    <td><b>Rank</b></td>
    <td><img src=\"https://custom-icon-badges.demolab.com/badge/-{$rank}-f4dbd6?labelColor=302d41&logo=trophy&logoColor=d9e0ee&style=for-the-badge\" alt=\"Rank\"/></td>
  </tr>
  <tr>
    <td><b>Bergabung</b></td>
    <td><img src=\"https://custom-icon-badges.demolab.com/badge/-{$created}-494d64?labelColor=302d41&logo=clock&logoColor=d9e0ee&style=for-the-badge\" alt=\"Bergabung\"/></td>
  </tr>
  <tr>
    <td><b>Teman</b></td>
    <td><img src=\"https://custom-icon-badges.demolab.com/badge/-{$friend}-8bd5ca?labelColor=302d41&logo=user-group&logoColor=d9e0ee&style=for-the-badge\" alt=\"Teman\"/></td>
  </tr>
  <tr>
    <td><b>Terima kasih</b></td>
    <td><img src=\"https://custom-icon-badges.demolab.com/badge/-{$thank}-ed8796?labelColor=302d41&logo=love&logoColor=d9e0ee&style=for-the-badge\" alt=\"Terima kasih\"/></td>
  </tr>
  <tr>
    <td><b>Jumlah jawaban</b></td>
    <td><img src=\"https://custom-icon-badges.demolab.com/badge/-{$total_answer}-a6da95?labelColor=302d41&logo=answer&logoColor=d9e0ee&style=for-the-badge\" alt=\"Jumlah jawaban\"/></td>
  </tr>
  <tr>
    <td><b>Jumlah pertanyaan</b></td>
    <td><img src=\"https://custom-icon-badges.demolab.com/badge/-{$total_question}-7dc4e4?labelColor=302d41&logo=question&logoColor=d9e0ee&style=for-the-badge\" alt=\"Jumlah pertanyaan\"/></td>
  </tr>
  <tr>
    <td><b>Jumlah jawaban tercerdas</b></td>
    <td><img src=\"https://custom-icon-badges.demolab.com/badge/-{$best_answer}-eed49f?labelColor=302d41&logo=brilliant&logoColor=d9e0ee&style=for-the-badge\" alt=\"Jumlah jawaban tercerdas\"/></td>
  </tr>
  <tr>
    <td><b>Jumlah jawaban tercerdas (30 hari terakhir)</b></td>
    <td><img src=\"https://custom-icon-badges.demolab.com/badge/-{$best_answer_30_day}-b7bdf8?labelColor=302d41&logo=brilliant&logoColor=d9e0ee&style=for-the-badge\" alt=\"Jumlah jawaban tercerdas\"/></td>
  </tr>
  <tr>
    <td><b>Tingkat</b></td>
    <td><img src=\"https://custom-icon-badges.demolab.com/badge/-{$grade}-c6a0f6?labelColor=302d41&logo=graduation-outline&logoColor=d9e0ee&style=for-the-badge\" alt=\"Tingkat\"/></td>
  </tr>
  <tr>
    <td><b>User terbantu</b></td>
    <td><img src=\"https://custom-icon-badges.demolab.com/badge/-{$helped_user}-f5bde6?labelColor=302d41&logo=user&logoColor=d9e0ee&style=for-the-badge\" alt=\"User terbantu\"/></td>
  </tr>
</table>

---

<p align=\"\">Copyright © {$new_year}</p> FΛZ";
        $file = fopen($readme_file, "w");
        fwrite($file, $readme_content);
        fclose($file);
        break;
      }
    }
  }
} else {
  echo "Pesan error: " . $data["errors"][0]["message"] . PHP_EOL;
}

?>
