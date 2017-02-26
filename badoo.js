window.opener = localStorage.getItem("opener") || "Kako ovo radi, jesmo li sad u vezi? :3";

window.bot = {
	getChat: function(id){
		var url = "/api.phtml?SERVER_OPEN_MESSENGER";

		var body = {"version":1,"message_type":468,"message_id":41,"body":[{"message_type":468,"server_open_messenger":{"contacts_user_field_filter":{"projection":[330,200,700,580,640,600,610,250,340,280,230,650,800,501],"profile_photo_size":{"square_face_photo_size":{"width":100,"height":100}}},"chat_user_field_filter":{"projection":[330,331,200,700,580,640,600,610,250,340,280,290,291,310,301,302,680,303,304,210,230,731,650,570],"profile_photo_size":{"square_face_photo_size":{"width":300,"height":300}}},"initial_screen_user_field_filter":{"projection":[410,490,471,800],"united_friends_filter":[{"section_type":1}]},"user_id":id}}]};

		var promise = new Promise(function(resolve, reject) {
			bot._sendRequest(url, body).then(function(chat){
				chat = chat.body[0].client_open_messenger.active_chat.initial_chat_screen;
				
				resolve(chat != undefined && chat.type == 2);
			});
		});
		return promise;
	},
	sendMessage: function(id){
		var url = "/api.phtml?SERVER_SEND_CHAT_MESSAGE";

		var body = {"version":1,"message_type":104,"message_id":14,"body":[{"message_type":104,"chat_message":{"mssg":window.opener,"message_type":1,"uid":"1484187978520","from_person_id":"227562224","to_person_id":id,"read":false,"chat_block_id":2}}]};

		var promise = new Promise(function(resolve, reject) {
			bot._sendRequest(url, body).then(function(user){
				resolve(true);
			});
		});
		return promise;
	},
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

		body = {"version":1,"message_type":416,"message_id":24,"body":[{"message_type":502,"server_get_search_settings":{"context_type":2}},{"message_type":245,"server_get_user_list":{"folder_id":25,"user_field_filter":{"projection":[250,200,210,230,310,330,530,540,340,331,680,290,291,301,303,304,302,260],"profile_photo_size":{"square_face_photo_size":{"width":180,"height":180}}},"offset":page*100,"preferred_count":100,"promo_block_request_params":[{"count":1,"position":2},{"count":1,"position":1}],"filter":[0]}}]};

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

			xhr.onreadystatechange = (function() {
				if (xhr.readyState == XMLHttpRequest.DONE) {
					resolve(JSON.parse(xhr.responseText));
				}
			});

			xhr.send(JSON.stringify(body));
		});

		return promise;
	},

	addMenuItem: function(text, icon, botFunctionName) {
		var html = '\
		    <div onclick="window.bot.{{botFunctionName}}();" style="cursor: pointer" class="sidebar-menu__item friends_">\
				<i class="icon icon--xsm">\
					<svg class="icon-svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{icon}}"></use></svg>\
					<span class="mark mark--sm mark--red invisible">0</span>\
				</i>\
				<b class="sidebar-menu__item-txt sidebar__el-hidden">{{text}}</b>\
				<span class="mark mark--red invisible">0</span>\
			</div>';
		
		html = html
			.replace('{{botFunctionName}}', botFunctionName)
			.replace('{{icon}}', icon)
			.replace('{{text}}', text);

		var element = document.createElement('div');
		element.innerHTML = html;
		
		var menu = document.getElementsByClassName("sidebar-menu")[0];
		menu.appendChild(element);
	},

	setOpener: function(){
		var opener = prompt("Opener? ", window.opener);

		window.opener = opener;
		localStorage.setItem("opener", opener);
	},

	massLike: function(){
		bot.getUsers().then(function(data){
			users = data.filter(function(user) {
				return user.online_status_text !== "Bila je na mreži pre više od nedelju dana"
					&& user.online_status_text !== "Bila je na mreži pre više od mesec dana"
					&& user.online_status_text !== "Was online more than a week ago"
					&& user.online_status_text !== "Was online more than a month ago";
			});

			users = users.map(function(user){return user.user_id});

			users = users.filter(function(user){
				if(localStorage.getItem("user-"+user) != undefined){
					return false;
				}

				return true;
			});

			users = users.slice(0, 100);

			var userDetailsPromises = users.map(function(user_id){
				return bot.getUser(user_id);
			});

			Promise.all(userDetailsPromises).then(function(users){
				var captcha = false;

				users = users.filter(function(user){
					if(user == undefined){
						captcha = true;
						return false;
					}
					else if(user.my_vote == 1){
						return true;
					}
					else
					{
						localStorage.setItem("user-" + user.user_id, true);

						return false;
					}
				});

				if(captcha){
					alert("Solve captcha! ");
					return;
				}

				console.log(users.length + " users to like! ");

				like_promises = users.map(function(user){return bot.vote(user.user_id)});

				Promise.all(like_promises).then(function(data){
					var likes_count = 0;

					data.forEach(function(like, key){
						if(like.body[0].message_type != 1){
							localStorage.setItem("user-" + users[key].user_id, true);

							likes_count++;
						}
					});

					alert("Liked " + likes_count + " users! ");
				});
			});
		});
	},

	massChat: function(){
		bot.getUsers().then(function(data){
			users = data.filter(function(user){return user.online_status_text != "online_status_text" && user.online_status_text != "Bila je na mreži pre više od nedelju dana" && user.online_status_text != " Was online more than a week ago"});

			users = users.map(function(user){return user.user_id});

			var chats = users.map(function(id){
				return bot.getChat(id);
			});

			Promise.all(chats).then(function(chats){
				users = users.filter(function(id, key){
					return chats[key];
				});

				alert("Sending message to "+users.length+" people! ");

				users.map(function(id){
					bot.sendMessage(id);
				})
			});
		});
	}
};

var interval = setInterval(function(){
	if(document.getElementsByClassName("sidebar-menu")[0] !== undefined){
		clearInterval(interval);
		bot.addMenuItem('Mass like', '#icon-heart', 'massLike');
		bot.addMenuItem('Mass chat', '#icon-chat', 'massChat');
		bot.addMenuItem('Set opener', '#icon-chat', 'setOpener');
	}
}, 1000);
