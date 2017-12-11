var API = {
	createURI: function(trackName, limit) {
		limit = limit || 20;

		return 'https://freemusicarchive.org/api/trackSearch?q='+trackName+'&limit='+limit;
	},
	trackURI: function(id) {
		return 'http://freemusicarchive.org/services/track/single/'+id+'.json';
	}
}

var APP = {
	tracks: [],
	search: function(input, event) {
		event.preventDefault();

		var name = input.val();

		if (name) {
			var url = API.createURI(name),
				self = this;

			$.get(url, function(response) {
				input.val('');

				self.tracks = JSON.parse(response).aRows;
				self.update();
			});
		}
	},
	onPlay: function(track) {
		var start = track.lastIndexOf('(') + 1,
			end = track.lastIndexOf(')'),
			trackId = track.slice(start, end),
			self = this;

		$.get(API.trackURI(trackId), function(response) {
			var track = JSON.parse(response);

			self.audio.attr('src', track.track_listen_url);
			self.audio.fadeIn();
		})
	},
	update: function() {
		this.traksHTML.html('');

		this.tracks
			.map(function(track) {
				var li = $('<li>'+track+'</li>');

				li.on('click', this.onPlay.bind(this, track));

				return li;
			}, this)
			.forEach(function(trackHTML) {
				this.traksHTML.append(trackHTML);
			}, this);
	},
	init: function(root) {
		var form = $('<form></form>'),
			input = $('<input type="text">'),
			button = $('<button type="submit">SUBMIT</button>');
		
		this.audio = $("<audio></audio>").attr({
			'volume':0.4,
			'autoplay':'autoplay',
			'controls': true
		});
		this.audio.fadeOut(0);
		this.traksHTML = $('<ul></ul>');

		form.on('submit', this.search.bind(this, input));

		form.append(input);
		form.append(button);

		root.html(form);
		root.append(this.audio);
		root.append(this.traksHTML);
	}
}

$(document).ready(function() {
	var root = $('#root');

	APP.init(root);
})