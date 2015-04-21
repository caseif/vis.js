<!DOCTYPE html>
<html>
	<head>
		<?php
		$songs = array();
		$file = fopen('songs.csv', 'r');
		while (!feof($file)) {
			$entries[] = fgets($file);
		}
		foreach ($entries as $key => $song){
			if (substr($song, 0, 1) != '#'){
				list($index, $file, $artist, $title, $genre) = explode("|", preg_replace('/\r|\n/', '', $song));
				$songs[$index] = array(
					'file' => $file,
					'artist' => $artist,
					'title' => $title,
					'genre' => $genre
				);
				unset($entries[$key]);
			}
		}
		fclose($file);
		$song = $songs[isset($_GET['song']) ? $_GET['song'] : array_rand($songs)];
		?>
		<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r71/three.js"></script>
		<link rel="stylesheet" href="vis.css">
		<link href='http://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'>
		<script>
			var file = '<?php echo $song['file']; ?>';
			var artist = '<?php echo $song['artist']; ?>';
			var title = '<?php echo $song['title']; ?>';
			var genre = '<?php echo isset($song['genre']) ? $song['genre'] : 'EDM'; ?>';
		</script>
		<title><?php echo $song['artist'].' &mdash; '.$song['title']; ?></title>
	</head>
	<body>
		<div id="loading">Loading music, please wait...</div>
		<div class="content">
			<canvas id="canvas" style="display: block;"></canvas>
			<div id="songinfo">
				<div class="names"><?php echo strtoupper($song['artist']); ?></div>
				<div class="title"><?php echo strtoupper($song['title']); ?></div>
			</div>
			<div class="ayylmao"><img class='kitty' src="./img/cat.gif" alt="ayy lmao"></div>
		</div>
		<div id="pause-info">Press P to pause</div>
		<div id="github"><a href="https://github.com/caseif/vis" target="_blank">Github</a></div>
		
		<script>
			$(document).ready(function() {
				function centerText() {
					$('.content').css('margin-top', ($(document).height() - $('.content').height()) / 2 - 80);
					$('.content').css('margin-left', ($(document).width() - $('.content').width()) / 2 - 52);
				};

				centerText();	

				$(window).resize(function() {
					centerText();
				});
			});
		</script>

		<script type="text/javascript" src="./js/vis.js"></script>
		
		<script type="text/javascript" src="./js/util.js"></script>
		<script type="text/javascript" src="./js/scene.js"></script>
		<script type="text/javascript" src="./js/geometry.js"></script>
		<script type="text/javascript" src="./js/light.js"></script>
		<script type="text/javascript" src="./js/render.js"></script>
	</body>
</html>
