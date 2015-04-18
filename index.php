<!DOCTYPE html>
<html>
	<head>
		<?php
		$songs = array(
			'gramophone' => array(
				'file' => 'gramophone.mp3',
				'artist' => 'Faux',
				'title' => 'Gramophone',
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
			),
			'therunner' => array(
				'file' => 'therunner.mp3',
				'artist' => 'Faux',
				'title' => 'The Runner',
				'genre' => 'Drum & Bass'
			),
			'myfriend' => array(
				'file' => 'myfriend.mp3',
				'artist' => 'Tristam',
				'title' => 'My Friend',
				'genre' => 'Drumstep'
			),
			'dreams' => array(
				'file' => 'dreams.mp3',
				'artist' => 'Rogue',
				'title' => 'Dreams (feat. Laura Brehm)',
				'genre' => 'Drumstep'
			),
			'onceagain' => array(
				'file' => 'onceagain.mp3',
				'artist' => 'Tristam',
				'title' => 'Once Again',
				'genre' => 'Glitch Hop'
			),
			'puresunlight' => array(
				'file' => 'puresunlight.mp3',
				'artist' => 'Mr Fijiwiji, Laura Brehm, & AgNO3',
				'title' => 'Pure Sunlight',
				'genre' => 'EDM'
			),
			'rainbowroad' => array(
				'file' => 'rainbowroad.mp3',
				'artist' => 'nanobii',
				'title' => 'Rainbow Road',
				'genre' => 'Hardcore'
			),
			'btmaerochord' => array(
				'file' => 'btmaerochord.mp3',
				'artist' => 'Excision & Pegboard Nerds',
				'title' => 'Bring The Madness (Aero Chord Remix)',
				'genre' => 'Trap'
			),
			'sandstorm' => array(
				'file' => 'sandstorm.mp3',
				'artist' => 'Darude',
				'title' => 'Sandstorm',
				'genre' => 'ayy lmao'
			),
			'sworchestral' => array(
				'file' => 'sworchestral.mp3',
				'artist' => 'Stephen Walking',
				'title' => 'Monstercat Orchestral Suite',
				'genre' => 'ayy lmao'
			),
			'beyondthesurface' => array(
				'file' => 'beyondthesurface.mp3',
				'artist' => 'Varien',
				'title' => 'Beyond The Surface (feat. Aloma Steele)',
				'genre' => 'EDM'
			),
			'loveandfear' => array(
				'file' => 'loveandfear.m4a',
				'artist' => 'FutureFreqs',
				'title' => 'Love & Fear',
				'genre' => 'EDM'
			),
			'changetheworld' => array(
				'file' => 'changetheworld.mp3',
				'artist' => 'Jetta',
				'title' => 'I&#39;d Love To Change The World (Matstubs Remix)',
				'genre' => 'Trap'
			),
			'leavingyou' => array(
				'file' => 'leavingyou.mp3',
				'artist' => 'Savoy & Sound Remedy',
				'title' => 'Leaving You (feat. Jojee)',
				'genre' => 'Future Bass'
			),
			'inertia' => array(
				'file' => 'inertia.mp3',
				'artist' => 'Draper',
				'title' => 'Inertia',
				'genre' => 'Glitch Hop'
			),
			'menandmachines' => array(
				'file' => 'menchines.mp3',
				'artist' => 'Draper',
				'title' => 'Men And Machines',
				'genre' => 'Dubstep'
			),
			'seeingstars' => array(
				'file' => 'seeingstars.mp3',
				'artist' => 'FutureFreqs',
				'title' => 'Seeing Stars',
				'genre' => 'Drumstep'
			)
		);
		$song = $songs[isset($_GET['song']) ? $_GET['song'] : array_rand($songs)];
		?>
		<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r71/three.js"></script>
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
		<div id="loading">Loading music, please wait...</div>
		<div class="content">
			<canvas id="canvas" style="display: block;"></canvas>
			<div id="songinfo">
				<div class="names"><?php echo strtoupper($song['artist']); ?></div>
				<div class="title"><?php echo strtoupper($song['title']); ?></div>
			</div>
			<div class="ayylmao"><img class='kitty' src="./img/cat.gif" alt="ayy lmao"></div>
		</div>
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
