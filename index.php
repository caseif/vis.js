<!DOCTYPE html>
<html>
	<head>
		<?php
		$songs = array(
			'gramophone' => array(
				'file' => 'gramophone.mp3',
				'artist' => 'FAUX',
				'title' => 'GRAMOPHONE',
				'genre' => 'EDM'
			),
			'gravity' => array(
				'file' => 'gravity.mp3',
				'artist' => 'UMPIRE',
				'title' => 'GRAVITY',
				'genre' => 'Dubstep'
			),
			'pressure' => array(
				'file' => 'pressure.mp3',
				'artist' => 'DRAPER',
				'title' => 'THE PRESSURE (FEAT. LAURA BREHM)',
				'genre' => 'EDM'
			),
			'equinox' => array(
				'file' => 'equinox.mp3',
				'artist' => 'SKRILLEX',
				'title' => 'FIRST OF THE YEAR (EQUINOX)',
				'genre' => 'Dubstep'
			),
			'triumph' => array(
				'file' => 'triumph.mp3',
				'artist' => 'WRLD',
				'title' => 'TRIUMPH',
				'genre' => 'Future Bass'
			),
			'friends' => array(
				'file' => 'friends.mp3',
				'artist' => 'GRABBITZ',
				'title' => 'FRIENDS (WITH FAUSTIX)',
				'genre' => 'Trap'
			),
			'thegirl' => array(
				'file' => 'thegirl.mp3',
				'artist' => 'HELLBERG',
				'title' => 'THE GIRL (FEAT. COZI ZUEHLSDORFF)',
				'genre' => 'House'
			)
		);
		$song = $songs[isset($_GET['song']) ? $_GET['song'] : array_rand($songs)];
		?>
		<title>vis</title>
		<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<link rel="stylesheet" href="vis.css">
		<script>
			var file = '<?php echo $song['file']; ?>';
			var artist = '<?php echo $song['artist']; ?>';
			var title = '<?php echo $song['title']; ?>';
			var genre = '<?php echo isset($song['genre']) ? $song['genre'] : 'EDM'; ?>';
		</script>
	</head>
	<body>
		<div id="hue">Loading moosic, please wait...</div>
		<div class="content">
			<canvas id="canvas" style="display: block;"></canvas>
			<div class="names"><?php echo $song['artist']; ?></div>
			<div class="title"><?php echo $song['title']; ?></div>
		</div>
		
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

		<script type="text/javascript" src="vis.js"></script>
	</body>
</html>
