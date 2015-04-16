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
				'artist' => 'Umpire',
				'title' => 'Gravity',
				'genre' => 'Dubstep'
			),
			'pressure' => array(
				'file' => 'pressure.mp3',
				'artist' => 'Draper',
				'title' => 'Pressure (feat. Laura Brehm)',
				'genre' => 'EDM'
			),
			'equinox' => array(
				'file' => 'equinox.mp3',
				'artist' => 'Skrillex',
				'title' => 'First Of The Year (Equinox)',
				'genre' => 'Dubstep'
			),
			'triumph' => array(
				'file' => 'triumph.mp3',
				'artist' => 'WRLD',
				'title' => 'Triumph',
				'genre' => 'Future Bass'
			),
			'friends' => array(
				'file' => 'friends.mp3',
				'artist' => 'Grabbitz',
				'title' => 'Friends (with Faustix)',
				'genre' => 'Trap'
			),
			'thegirl' => array(
				'file' => 'thegirl.mp3',
				'artist' => 'Hellberg',
				'title' => 'The Girl (feat. Cozi Zuehlsdorff)',
				'genre' => 'House'
			)
		);
		$song = $songs[isset($_GET['song']) ? $_GET['song'] : array_rand($songs)];
		?>
		<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<link rel="stylesheet" href="vis.css">
		<script>
			var file = '<?php echo $song['file']; ?>';
			var artist = '<?php echo $song['artist']; ?>';
			var title = '<?php echo $song['title']; ?>';
			var genre = '<?php echo isset($song['genre']) ? $song['genre'] : 'EDM'; ?>';
		</script>
		<title><?php echo $song['artist'].' &mdash; '.$song['title']; ?></title>
	</head>
	<body>
		<div id="hue">Loading moosic, please wait...</div>
		<div class="content">
			<canvas id="canvas" style="display: block;"></canvas>
			<div class="names"><?php echo strtoupper($song['artist']); ?></div>
			<div class="title"><?php echo strtoupper($song['title']); ?></div>
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
