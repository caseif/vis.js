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
			)
		);
		$song = $songs[$_GET['song']];
		?>
		<title>vis</title>
		<script type="text/javascript" src="http://amigocraft.net/js/jquery.min.js"></script>
		<link rel="stylesheet" href="vis.css">
		<script>
			var file = '<?php echo $song['file']; ?>';
			var artist = '<?php echo $song['artist']; ?>';
			var title = '<?php echo $song['title']; ?>';
			var genre = '<?php echo isset($song['genre']) ? $song['genre'] : 'EDM'; ?>';
		</script>
	</head>
	<body>
		<div id="hue">Loading moosic (Sit back and get yourself a coffee)...</div>
		<div class="content">
			<canvas id="canvas" width="1000" height="325" style="display: block;"></canvas>
			<div class="names"><?php echo $song['artist']; ?></div>
			<div class="title"><?php echo $song['title']; ?></div>
		</div>

		<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<script type="text/javascript" src="vis.js"></script>
	</body>
</html>
