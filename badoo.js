bot = {
	getUser: function(id){
		var url = "/api.phtml?SERVER_GET_USER";

		var body = {"$gpb":"badoo.bma.BadooMessage","version":1,"message_type":403,"message_id":6,"body":[{"$gpb":"badoo.bma.MessageBody","message_type":403,"server_get_user":{"$gpb":"badoo.bma.ServerGetUser","user_id":id,"client_source":2,"user_field_filter":{"$gpb":"badoo.bma.UserFieldFilter","projection":[800,370,200,230,210,30,360,93,301,302,680,303,304,250,600,290,291,610,310,690,691,692,693,440,311,490,660,650,460,750,731,730,100,340,580,570,410,420,480,90,470,742,741,740,550,681,670,870,330,331,260,530,540],"request_albums":[{"$gpb":"badoo.bma.ServerGetAlbum","preview_size":{"$gpb":"badoo.bma.PhotoSize","height":180,"width":180},"album_type":2},{"$gpb":"badoo.bma.ServerGetAlbum","preview_size":{"$gpb":"badoo.bma.PhotoSize","height":180,"width":180},"album_type":4}],"united_friends_filter":[{"$gpb":"badoo.bma.UnitedFriendsFilter","count":5,"section_type":3},{"$gpb":"badoo.bma.UnitedFriendsFilter","count":5,"section_type":1},{"$gpb":"badoo.bma.UnitedFriendsFilter","count":5,"section_type":2}],"request_interests":{"$gpb":"badoo.bma.ServerInterestsGet","user_id":id,"limit":500}},"visiting_source":{"$gpb":"badoo.bma.ProfileVisitingSource","person_id":id,"source_folder":25,"visiting_source":2}}}]};

		var promise = new Promise(function(resolve, reject) {
			bot._sendRequest(url, body).then(function(user){
				user = user.body[0].user;

				resolve(user);
			});
		});
		return promise;
	},

	getUsers: function(page = 0){
		var url = "/api.phtml?SERVER_GET_USER_LIST_WITH_SETTINGS";

		body = {"$gpb":"badoo.bma.BadooMessage","version":1,"message_type":416,"message_id":18,"body":[{"$gpb":"badoo.bma.MessageBody","message_type":137,"search_settings_context":{"$gpb":"badoo.bma.SearchSettingsContext","search_response_context":2}},{"$gpb":"badoo.bma.MessageBody","message_type":245,"server_get_user_list":{"$gpb":"badoo.bma.ServerGetUserList","folder_id":25,"user_field_filter":{"$gpb":"badoo.bma.UserFieldFilter","projection":[250,200,210,230,310,330,530,540,340,331,680,290,291,301,303,304,302,260],"profile_photo_size":{"$gpb":"badoo.bma.PhotoSizeSpec","square_face_photo_size":{"$gpb":"badoo.bma.PhotoSize","width":180,"height":180}}},"offset":page * 100,"preferred_count":100,"promo_block_request_params":[{"$gpb":"badoo.bma.PromoBlockRequestParams","count":1,"position":2},{"$gpb":"badoo.bma.PromoBlockRequestParams","count":1,"position":1}]}}]};

		var promise = new Promise(function(resolve, reject) {
			bot._sendRequest(url, body).then(function(users){
				var page_count = users.body[1].client_user_list.total_count / 100;
				users = users.body[1].client_user_list.section[0].users;

				if(page == 0){
					promises = [];

					for(i = 1; i < page_count; i++){
						promises.push(bot.getUsers(i));
					}

					Promise.all(promises).then(function(more_users){
						more_users.forEach(function(more_users_unit){
							users = users.concat(more_users_unit);
						});

						resolve(users);
					});
				}
				else
				{
					resolve(users);
				}
			});
		});

		return promise;
	},

	vote: function(id){
		var url = "/api.phtml?SERVER_ENCOUNTERS_VOTE";

		var body = {"$gpb":"badoo.bma.BadooMessage","version":1,"message_type":80,"message_id":56,"body":[{"$gpb":"badoo.bma.MessageBody","message_type":80,"server_encounters_vote":{"$gpb":"badoo.bma.ServerEncountersVote","person_id":id,"vote":2,"vote_source":65}}]};

		return this._sendRequest(url, body);
	},

	_sendRequest(url, body){
		var promise = new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-Type', 'json');

			xhr.setRequestHeader('X-Session-id', B.Session.getSessionId());
			xhr.setRequestHeader('X-User-id', B.Session.getUserId());

			xhr.onreadystatechange = function() {
				if (xhr.readyState == XMLHttpRequest.DONE) {
					resolve(JSON.parse(xhr.responseText));
				}
			}

			xhr.send(JSON.stringify(body));
		});

		return promise;
	}
}

bot.getUsers().then(function(data){
	users = data.filter(function(user){return user.online_status < 3});

	console.log(data);

	users = users.map(function(user){return user.user_id});

	var userDetailsPromises = users.map(function(user_id){
		return bot.getUser(user_id);
	});

	Promise.all(userDetailsPromises).then(function(users){
		users = users.filter(function(user){return user.my_vote == 1});

		console.log(users.length + " users to like! ");

		like_promises = users.map(function(user){return bot.vote(user.user_id)});

		Promise.all(like_promises).then(function(data){
			var likes_count = 0;

			data.forEach(function(like){
				if(like.body[0.message_type != 1]){
					likes_count++;
				}

				console.log("Liked " + likes_count + " users! ");
			});
		});
	});
});

