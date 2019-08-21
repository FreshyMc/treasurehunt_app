var teamsObj = {};

(function(){
    var firebaseConfig = {
            apiKey: "AIzaSyAdkyQLBBLhfQj8xQyc81lDTWQ2sexWJSY",
            authDomain: "treasurehunttest-21a49.firebaseapp.com",
            databaseURL: "https://treasurehunttest-21a49.firebaseio.com",
            projectId: "treasurehunttest-21a49",
            storageBucket: "",
            messagingSenderId: "158026706444",
            appId: "1:158026706444:web:0c5695020c9aecb2"
        };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    var database = firebase.database();
    
    var ref = database.ref(), 
        usersRef = ref.child('users'),
        gamesRef = ref.child('games'),
        teamsRef = ref.child('teams'),
        progressesRef = ref.child('progress');

    var doc = document,
        usersTable = doc.getElementById('users'),
        teamShowcaseBox = doc.getElementById('team-showcase'),
        gamesTable = doc.getElementById('games'),
        teamsTable = doc.getElementById('teams'),
        nav = doc.getElementById('nav'),
        navBtns = doc.querySelectorAll('#nav button'),
        pages = doc.querySelectorAll('.page');

    usersRef.on('child_added', snap => {
        appendUser(snap.key, snap.val());
    });

    gamesRef.on('child_added', snap => {
        console.log('game added');
        appendGame(snap.key, snap.val());
    });

    gamesRef.on('child_changed', snap => {
        updateGame(snap.key, snap.val());
    });

    teamsRef.on('child_added', snap => {
        console.log('team added');
        appendTeam(snap.key, snap.val());
    });

    function appendTeam(key, team){
        var tr = doc.createElement('tr'),
            teamName = doc.createElement('td'),
            teamLeader = doc.createElement('td'),
            teamMembers = doc.createElement('td'),
            dateRegistered = doc.createElement('td');

        teamName.textContent = team.name;
        
        database.ref('/users/' + team.leaderId).once('value').then( snap => {
            teamLeader.textContent = snap.val().name;
        });

        var teamMembersUl = doc.createElement('ul');

        team.members.forEach( member => {
            database.ref('/users/' + member).once('value').then( snap => {
                var memberLi = doc.createElement('li');

                memberLi.textContent = snap.val().name;

                teamMembersUl.appendChild(memberLi);
            });
        });

        teamMembers.appendChild(teamMembersUl);

        dateRegistered.textContent = (new Date(team.registeredTimestamp)).toString();

        tr.appendChild(teamName);
        tr.appendChild(teamLeader);
        tr.appendChild(teamMembers);
        tr.appendChild(dateRegistered);

        teamsTable.appendChild(tr);
    }

    function appendGame(key, game){
        var tr = doc.querySelector('.game').cloneNode(true),
            gameName = tr.querySelector('.game_name'),
            coverImgUrl =  tr.querySelector('.cover_image'),
            gameEnd =  tr.querySelector('.game_end'),
            gameStory =  tr.querySelector('.game_story'),
            helpLinkUrl =  tr.querySelector('.help_link'),
            helpNumber =  tr.querySelector('.help_number'),
            mapLinkUrl =  tr.querySelector('.map_link'),
            maxPlayers =  tr.querySelector('.max_players'),
            minPlayers =  tr.querySelector('.min_players'),
            startImageUrl =  tr.querySelector('.start_img_link'),
            startPassword =  tr.querySelector('.start_password'),
            gameStart =  tr.querySelector('.game_start'),
            actions =  tr.querySelector('.actions');

        tr.setAttribute('data-key', key);

        tr.style.display = 'block';

        gameName.textContent = game.name;

        coverImgUrl.src = game.coverImageUrl;

        gameEnd.textContent = (new Date(game.endTimestamp)).toString();

        gameStory.textContent = game.gameStoryDetails;

        var helpLink = doc.createElement('a');

        helpLink.href = game.helpLink;

        helpLink.textContent = 'Help link';

        helpLinkUrl.appendChild(helpLink);

        helpNumber.textContent = game.helpNumber;

        var mapLink = doc.createElement('a');

        mapLink.href = game.mapUrl;
        
        mapLink.textContent = 'Map url';

        mapLinkUrl.appendChild(mapLink);

        maxPlayers.textContent = game.maxPlayers;

        minPlayers.textContent = game.minPlayers;

        var startImg = doc.createElement('img');

        startImg.src = game.startImageUrl;

        startImageUrl.appendChild(startImg);

        startPassword.textContent = game.startPassword;

        gameStart.textContent = (new Date(game.startTimestamp)).toString();

        var deleteBtn = doc.createElement('button'),
            editBtn = doc.createElement('button');

        deleteBtn.textContent = 'Delete';

        deleteBtn.addEventListener('click', e => {
            if(confirm('Are you sure that you want to delete this game?')){
                deleteGame(e);
            }
        });

        editBtn.textContent = 'Edit';

        editBtn.setAttribute('data-popupname', 'edit-game');

        editBtn.addEventListener('click', e => {
            populatePopUp(e);
            openPopUp(e);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        tr.appendChild(gameName);
        tr.appendChild(coverImgUrl);
        tr.appendChild(gameEnd);
        tr.appendChild(gameStory);
        tr.appendChild(helpLinkUrl);
        tr.appendChild(helpNumber);
        tr.appendChild(mapLinkUrl);
        tr.appendChild(maxPlayers);
        tr.appendChild(minPlayers);
        tr.appendChild(startImageUrl);
        tr.appendChild(startPassword);
        tr.appendChild(gameStart);
        tr.appendChild(actions);

        doc.querySelector('[data-page="games"]').appendChild(tr);
    }

    function deleteGame(e){
        var deleteBtn = e.currentTarget,
            tr = deleteBtn.parentElement.parentElement,
            key = tr.getAttribute('data-key');

        gamesRef.child(key).remove();

        tr.remove();
    }

    function updateGame(key, game){
        var node = doc.querySelector('[data-key="' + key + '"]');

        node.remove();

        var tr = doc.createElement('tr'),
            gameName = doc.createElement('td'),
            coverImgUrl = doc.createElement('td'),
            gameEnd = doc.createElement('td'),
            gameStory = doc.createElement('td'),
            helpLinkUrl = doc.createElement('td'),
            helpNumber = doc.createElement('td'),
            mapLinkUrl = doc.createElement('td'),
            maxPlayers = doc.createElement('td'),
            minPlayers = doc.createElement('td'),
            startImageUrl = doc.createElement('td'),
            startPassword = doc.createElement('td'),
            gameStart = doc.createElement('td'),
            actions = doc.createElement('td');

        tr.setAttribute('data-key', key);

        gameName.textContent = game.name;
        
        var coverImg = doc.createElement('img');

        coverImg.src = game.coverImageUrl;

        coverImgUrl.appendChild(coverImg);

        gameEnd.textContent = (new Date(game.endTimestamp)).toString();

        gameStory.textContent = game.gameStoryDetails;

        var helpLink = doc.createElement('a');

        helpLink.href = game.helpLink;

        helpLink.textContent = 'Help link';

        helpLinkUrl.appendChild(helpLink);

        helpNumber.textContent = game.helpNumber;

        var mapLink = doc.createElement('a');

        mapLink.href = game.mapUrl;
        
        mapLink.textContent = 'Map url';

        mapLinkUrl.appendChild(mapLink);

        maxPlayers.textContent = game.maxPlayers;

        minPlayers.textContent = game.minPlayers;

        var startImg = doc.createElement('img');

        startImg.src = game.startImageUrl;

        startImageUrl.appendChild(startImg);

        startPassword.textContent = game.startPassword;

        gameStart.textContent = (new Date(game.startTimestamp)).toString();

        var deleteBtn = doc.createElement('button'),
            editBtn = doc.createElement('button');

        deleteBtn.textContent = 'Delete';

        editBtn.textContent = 'Edit';

        editBtn.setAttribute('data-popupname', 'edit-game');

        editBtn.addEventListener('click', e => {
            populatePopUp(e);
            openPopUp(e);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        tr.appendChild(gameName);
        tr.appendChild(coverImgUrl);
        tr.appendChild(gameEnd);
        tr.appendChild(gameStory);
        tr.appendChild(helpLinkUrl);
        tr.appendChild(helpNumber);
        tr.appendChild(mapLinkUrl);
        tr.appendChild(maxPlayers);
        tr.appendChild(minPlayers);
        tr.appendChild(startImageUrl);
        tr.appendChild(startPassword);
        tr.appendChild(gameStart);
        tr.appendChild(actions);

        gamesTable.insertBefore(tr, gamesTable.childNodes[2]);
    }

    function appendUser(key, user){
        var tr = doc.createElement('tr'),
            username = doc.createElement('td'),
            email = doc.createElement('td'),
            age = doc.createElement('td'),
            teams = doc.createElement('td'),
            progress = doc.createElement('td'),
            phone = doc.createElement('td');

        tr.setAttribute('data-key', key);

        username.textContent = user.name;
        age.textContent = user.age;
        email.textContent = user.email;
        phone.textContent = user.phone;
        //teams.textContent = JSON.stringify(user.teams);
        //progress.textContent = JSON.stringify(user.progress);

        if(typeof user.teams !== 'undefined'){
            user.teams.forEach(team=>{
                database.ref('/teams/' + team).once('value').then(snap => {
                    let teamKey = team,
                        teamObj = snap.val(),
                        teamName = teamObj.name;

                    var teamLink = doc.createElement('a');

                    teamLink.setAttribute('data-key', teamKey);

                    teamLink.textContent = teamName;

                    teamLink.addEventListener('mouseover', showTeam);

                    teamLink.addEventListener('mouseout', hideTeamShowcase);

                    teamLink.href = '#teamshowcase';

                    teams.appendChild(teamLink);

                    if(!teamsObj.hasOwnProperty(teamName)){
                        teamsObj[teamKey] = teamObj;
                    }
                }).catch(err => {
                    console.log('Error', err);
                });
            });
        }

        tr.appendChild(username);
        tr.appendChild(email);
        tr.appendChild(age);
        tr.appendChild(teams);
        tr.appendChild(progress);
        tr.appendChild(phone);

        usersTable.appendChild(tr);
    }

    function showTeam(e){
        e.preventDefault();

        var el = e.currentTarget,
            teamKey = el.getAttribute('data-key'),
            teamObj = teamsObj[teamKey];

        teamShowcaseBox.style.display = 'block';
        teamShowcaseBox.style.left = offset(el).left + 'px';
        teamShowcaseBox.style.top = offset(el).top + 'px';

        var teamName = doc.getElementById('team-name'),
            teamLeader =  doc.getElementById('team-leader'),
            teamMembers = doc.getElementById('team-members'),
            teamDateRegistered = doc.getElementById('team-date-registered');

        while(teamMembers.firstChild){
            teamMembers.firstChild.remove();
        }

        teamName.textContent = teamObj.name;

        database.ref('/users/' + teamObj.leaderId).once('value').then(snap => {
            teamLeader.textContent = snap.val().name;
        });

        teamObj.members.forEach(member => {
            database.ref('/users/' + member).once('value').then(snap=> {
                var memberLi = doc.createElement('li');

                memberLi.textContent = snap.val().name;

                teamMembers.appendChild(memberLi);
            });
        });

        teamDateRegistered.textContent = (new Date(teamObj.registeredTimestamp)).toString();
    }

    function hideTeamShowcase(e){
        teamShowcaseBox.style.display = 'none';
    }

    function offset(el) {
        var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

    navBtns.forEach(btn => {
        btn.addEventListener('click', openPage);
    });

    function openPage(e){
        var el = e.currentTarget,
            pageToOpen = el.getAttribute('data-for'),
            page = doc.querySelector('[data-page="' + pageToOpen + '"]');

        pages.forEach(page => {
            page.style.display = 'none';
        });
        
        page.style.display = 'block';
    }

    var formNames = [{name: 'create-game', method: createGame}, {name: 'edit-game', method: editGame}],
        closeBtns = doc.querySelectorAll('.form .close'),
        openBtns = doc.querySelectorAll('.open');

    formNames.forEach(formObj => {
        var form = doc.querySelector('.' + formObj.name);

        form.addEventListener('submit', formObj.method); 
    });

    openBtns.forEach(btn => {
        btn.addEventListener('click', openPopUp);
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closePopUp);
    });

    function openPopUp(e){
        e.preventDefault();

        var el = e.currentTarget,
            popUpName = el.getAttribute('data-popupname'),
            popUp = doc.querySelector('.' + popUpName);

        console.log('.' + popUpName);

        popUp.style.display = 'block';
    }

    function populatePopUp(e){
        var el = e.currentTarget,
            parent = el.parentElement.parentElement,
            key = parent.getAttribute('data-key');

        database.ref('/games/' + key).once('value').then( snap => {
            var form = doc.querySelector('.edit-game');

            form.setAttribute('data-key', key);

            var startTimestamp = (new Date(snap.val().startTimestamp)).toISOString().slice(0,16),
                endTimestamp = (new Date(snap.val().endTimestamp)).toISOString().slice(0,16);

            console.log(startTimestamp, endTimestamp);

            form['game_name'].value = snap.val().name,
            form['cover_img'].value = snap.val().coverImageUrl,
            doc.getElementById('game_end_edit').value = endTimestamp,
            doc.getElementById('game_start_edit').value = startTimestamp,
            form['game_story'].value = snap.val().gameStoryDetails,
            form['help_link'].value = snap.val().helpLink,
            form['map_link'].value = snap.val().mapUrl,
            form['help_number'].value = snap.val().helpNumber,
            form['max_players'].value = snap.val().maxPlayers,
            form['min_players'].value = snap.val().minPlayers,
            form['start_img_link'].value = snap.val().startImageUrl,
            form['start_pass'].value = snap.val().startPassword;
        });
    }

    function editGame(e){
        e.preventDefault();

        var form = e.target;

        if(!validateForm(form)){
            return alert('Fill all inputs which border is in red color!');
        }

        var closeBtn = e.target.querySelector('.close');

        var gameName = form['game_name'].value,
            coverImg = form['cover_img'].value,
            gameEnd = form['game_end'].value,
            gameStart = form['game_start'].value,
            gameStory = form['game_story'].value,
            helpLink = form['help_link'].value,
            mapLink = form['map_link'].value,
            helpNumber = form['help_number'].value,
            maxPlayers = form['max_players'].value,
            minPlayers = form['min_players'].value,
            startImgLink = form['start_img_link'].value,
            startPass = form['start_pass'].value,
            key = form.getAttribute('data-key');

        var gameStartTimestamp = new Date(gameStart).getTime(),
            gameEndTimestamp = new Date(gameEnd).getTime();

        gamesRef.child(key).update({
            chapters: {},
            name: gameName,
            coverImageUrl: coverImg, 
            gameStoryDetails: gameStory,
            helpLink: helpLink,
            helpNumber: helpNumber,
            mapUrl: mapLink,
            maxPlayers: maxPlayers,
            minPlayers: minPlayers,
            startImageUrl: startImgLink,
            startPassword: startPass,
            startTimestamp: gameStartTimestamp,
            endTimestamp: gameEndTimestamp
        });

        closeBtn.click();
    }

    function closePopUp(e){
        e.preventDefault();

        var el = e.currentTarget,
            popUpName = el.getAttribute('data-popupname'),
            popUp = doc.querySelector('.' + popUpName);

        popUp.style.display = 'none';
    }

    function createGame(e){
        e.preventDefault();

        var form = e.target;

        if(!validateForm(form)){
            return alert('Fill all inputs which border is in red color!');
        }

        var closeBtn = e.target.querySelector('.close');

        var gameName = form['game_name'].value,
            coverImg = form['cover_img'].value,
            gameEnd = form['game_end'].value,
            gameStart = form['game_start'].value,
            gameStory = form['game_story'].value,
            helpLink = form['help_link'].value,
            mapLink = form['map_link'].value,
            helpNumber = form['help_number'].value,
            maxPlayers = form['max_players'].value,
            minPlayers = form['min_players'].value,
            startImgLink = form['start_img_link'].value,
            startPass = form['start_pass'].value;

        var gameStartTimestamp = new Date(gameStart).getTime(),
            gameEndTimestamp = new Date(gameEnd).getTime();

        gamesRef.push().set({
            chapters: {},
            name: gameName,
            coverImageUrl: coverImg, 
            gameStoryDetails: gameStory,
            helpLink: helpLink,
            helpNumber: helpNumber,
            mapUrl: mapLink,
            maxPlayers: maxPlayers,
            minPlayers: minPlayers,
            startImageUrl: startImgLink,
            startPassword: startPass,
            startTimestamp: gameStartTimestamp,
            endTimestamp: gameEndTimestamp
        });

        closeBtn.click();

        form.reset();
    }

    function validateForm(form){
        var formElements = form.elements,
            validated = true;

        for (i = 0; i < formElements.length; i++) {
            var element = formElements[i];

            element.style.borderColor = 'rgba(0,0,0, .2)';

            if(element.type == 'text' || element.type == 'password' || element.type == 'number' || element.type == 'tel' || element.nodeName == 'textarea'){
                if(element.value == ''){
                    element.style.borderColor = '#d63031';
                    validated = false;
                }
            }
        };

        return validated;
    }
})();