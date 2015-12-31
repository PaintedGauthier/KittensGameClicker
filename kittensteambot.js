// ==UserScript==
// @name        Kitten Steam Bot
// @namespace   http://gauthierstudio.com
// @description Start kitten automation
// @include     *bloodrizer.ru/games/kittens/*
// @version    0.0.3
// @grant       none
// @copyright   2015, gauthier
// @downloadURL https://dl.dropboxusercontent.com/content_link/rKs3y2Z1wR7AhjVem6BCud9LL1sx2DmhnCDu0F44LvgA1RGDLC6Iu4SzqKMGbobc?dl=1
// @updateURL https://dl.dropboxusercontent.com/content_link/rKs3y2Z1wR7AhjVem6BCud9LL1sx2DmhnCDu0F44LvgA1RGDLC6Iu4SzqKMGbobc?dl=1
// ==/UserScript==

// ==========================================
// Begin Kitten Steam Bot
// ==========================================
// some code bits repurposed from kitten scientists
// https://github.com/cameroncondry/cbc-kitten-scientists


//addEventListener('DOMContentLoaded', function() {
	
	window.sengine = false;
	sengine = window.sengine;
	$doc = $(document);
	
	
	$('#devModeButton').remove();
	
	var pageaction_addbuttons = {
		'Bonfire' : function() {
			for (var i = 0; i < gamePage.tabs[0].buttons.length; ++i) {
				var button = gamePage.tabs[0].buttons[i];
				button.toggledata = false;
				if (typeof button.buildingName == 'undefined')
					continue;
			
				var bname = button.buildingName;
				
				if (!sengine.kittenStorage.buildingtoggles[bname])
					continue;
				
				var bldtoggle = sengine.kittenStorage.buildingtoggles[bname];
				button.toggledata = bldtoggle;
				
				
				if (typeof button.autobuild == 'undefined' || !button.autobuild) {
					button.autobuild = button.addLink( bldtoggle.enabled ? '<small>&#9989</small>' : 'X',
						function(e){
							
							this.toggledata.enabled = !this.toggledata.enabled;
							
							this.autobuild.link.innerHTML = this.toggledata.enabled ? '<small>&#9989</small>' : 'X';
							var f = this.toggledata.enabled ? toggleon : toggleoff;
							f('Building '  + this.buildingName +  (this.toggledata.enabled ? ' Enabled' : ' Disabled'));
							sengine.saveToKittenStorage();
							
						}, true	//use | break
					);
					//console.log('button ', button);
				}
			}
		},
		'Workshop': function() {
		
			if (!sengine.kittenStorage.workshoptoggles) {
				sengine.kittenStorage.workshoptoggles = {}
			}
			for (var i = 0; i < gamePage.workshopTab.buttons.length; ++i) {
				
				var btn = gamePage.workshopTab.buttons[i];
				if (btn.workshoptoggleBtn) 
					continue;
				
				var cb = gamePage.workshopTab.buttons[i];
				
				if (!sengine.kittenStorage.workshoptoggles[cb.upgradeName]) {
					sengine.kittenStorage.workshoptoggles[cb.upgradeName] = {
						name: cb.upgradeName,
						enabled: true
					}
				}
				
				var wt = sengine.kittenStorage.workshoptoggles[cb.upgradeName];
				
				btn.workshoptoggle = wt;
				btn.workshopBtn = cb.addLink( wt.enabled ? '<small>&#9989</small>' : 'X',
					function(e){
						
						this.workshoptoggle.enabled = !this.workshoptoggle.enabled;
						var f = this.workshoptoggle.enabled ? toggleon : toggleoff;
						f('Workshop '  + this.workshoptoggle.title +  (this.workshoptoggle.enabled ? ' Enabled' : ' Disabled'));
						this.workshopBtn.link.innerHTML = this.workshoptoggle.enabled ? '<small>&#9989</small>' : 'X';
						sengine.saveToKittenStorage();
					}, true	//use | break
				);	
				
			}
		
			for (var i = 0; i < gamePage.workshopTab.craftBtns.length; ++i) {
				
				var cb = gamePage.workshopTab.craftBtns[i];
				if (cb.crafttoggleBtn) 
					continue;
				if (!sengine.kittenStorage.craftingtoggles[cb.craftName])
					continue;
				var ct = sengine.kittenStorage.craftingtoggles[cb.craftName];
				ct.title = cb.craftName;
				cb.crafttoggle = ct;
				cb.crafttoggleBtn = cb.addLink( ct.enabled ? '<small>&#9989</small>' : 'X',
					function(e){
						
						this.crafttoggle.enabled = !this.crafttoggle.enabled;
						var f = this.crafttoggle.enabled ? toggleon : toggleoff;
						f('Crafting '  + this.crafttoggle.title +  (this.crafttoggle.enabled ? ' Enabled' : ' Disabled'));
						this.crafttoggleBtn.link.innerHTML = this.crafttoggle.enabled ? '<small>&#9989</small>' : 'X';
						sengine.saveToKittenStorage();
						// update green lines and such
						gamePage.craftTable.render();
					}, true	//use | break
				);	
				
			}
			
			
		},
		'Trade' : function() {
			console.log('checking trade');
			for (var i = 0; i < gamePage.diplomacyTab.racePanels.length; ++i) {
					
				var panel = gamePage.diplomacyTab.racePanels[i];
				if (!panel.tradeBtn) {
					console.log('no button');
					return;
				}
				if (typeof panel.tradeBtn.autotrade == 'undefined') {
				
					var raceoption = sengine.kittenStorage.traders[panel.race.name];
					raceoption.name = panel.race.name;
					console.log('adding button ', raceoption);
					panel.tradeBtn.toggledata = raceoption;
					panel.tradeBtn.autotrade = panel.tradeBtn.addLink( raceoption.enabled ? '<small>&#9989</small>' : 'X',
						function(e){
						console.log('clicked button ', this.toggledata);
							
							this.toggledata.enabled = !this.toggledata.enabled;
							var f = this.toggledata.enabled ? toggleon : toggleoff;
							f('Trading with '  + this.toggledata.name +  (this.toggledata.enabled ? ' Enabled' : ' Disabled'));
							this.autotrade.link.innerHTML = this.toggledata.enabled ? '<small>&#9989</small>' : 'X';
							sengine.saveToKittenStorage();
							
						}, true	//use | break
					);
				
				}
				
			}
			
		},
		'Space_notyet' : function() { 
			
			if (typeof gamePage.spaceTab == 'undefined' || gamePage.spaceTab == null)
				return;
			if (typeof gamePage.spaceTab.GCPanel == 'undefined' || gamePage.spaceTab.GCPanel == null)
				return;
			if (typeof gamePage.spaceTab.GCPanel.children == 'undefined' || gamePage.spaceTab.GCPanel.children == null)
				return;
			
			for (var i = 0 ; i < gamePage.spaceTab.GCPanel.children.length; ++i) {
				
				var gcitem = gamePage.spaceTab.GCPanel.children[i];
				
				if (!sengine.kittenStorage.buildingtoggles[gcitem.id]) {
					
					sengine.kittenStorage.buildingtoggles[gcitem.id] = {
						prices: [],
						flavor: ' the taste of a '+gcitem.id,
						handler: function() {
							this.enabled = !this.enabled;
						},
						cost: {},
						// record of amounts we previously had
						previous: false,
						togglable: true,
						enabled: false,
						description: 'Auto make ' + gcitem.name,
						name: gcitem.name + ' Auto'
					};
					
				}
				
				var bldtoggle = sengine.kittenStorage.buildingtoggles[gcitem.id];
				console.log('toggle space on ', bldtoggle);
				gcitem.toggledata = bldtoggle;
				
				
				if (typeof gcitem.autobuild == 'undefined' || !gcitem.autobuild) {
					console.log(gcitem, bldtoggle);
					gcitem.autobuild = gcitem.addLink( bldtoggle.enabled ? '<small>&#9989</small>' : 'X',
						function(e){
							
							this.toggledata.enabled = !this.toggledata.enabled;
							console.log('toggled  ', this.toggledata);
							
							this.autobuild.link.innerHTML = this.toggledata.enabled ? '<small>&#9989</small>' : 'X';
							console.log('toggled b ', this);
							sengine.saveToKittenStorage();
							
						}, true	//use | break
					);
					console.log('space ', gcitem);
					
				}
				
				
			}
		}
		
		
	};
	

	
	// running on localhost button break horribly and refresh the page
	$('a').click(function(){ return false; });
	var game = gamePage;
	window.onbeforeunload = function() {
		sengine.saveToKittenStorage();
	}

	if (typeof hijackedresourcerender == 'undefined')
		hijackedresourcerender = false;

	var SteamEngine = function() {
		this.version = 'Kitten Steam Bot version 0.0.1';
		this.address = 'catfacemeowmers';
		this.namespace = 'com.gauthierstudio.kittensteambot';
		// local storage
		this.kittenStorageVersion = 1;
	};


	var options = {
		debug:         false,
		interval:      2000,
		msgcolor:      '#aa50fe', // dark purple
		summarycolor:  '#009933', // light green
		activitycolor: '#E65C00', // orange
		enabledcolor:  '#007711', // not as light green
		disabledcolor: '#991111', // dark red...
		showactivity:  true,
		consume:       0.6,
		logMessages:   100
		
	};



	// Custom Pages
	// ====================

	var TabManager = function (name) {
		this.setTab(name);
	};

	TabManager.prototype = {
		tab: undefined,
		render: function () {
			if (this.tab && game.activeTabId !== this.tab.tabId) this.tab.render();

			return this;
		},
		setTab: function (name) {
			for (var tab in game.tabs) {
				if (game.tabs[tab].tabId === name) {
					this.tab = game.tabs[tab];
					break;
				}
			}

			this.tab ? this.render() : warning('unable to find tab ' + name);
		}
	};

	dojo.declare("com.nuclearunicorn.game.ui.OptionModern", com.nuclearunicorn.game.ui.ButtonModern, {
		sellHref: null,
		toggleHref: null,
		opts: null,

		constructor: function(opts, game){
			this.opts = opts;
			this.on = this.opts.enabled ? 1 : 0;
			this.update();
		},
		update: function() {
			if (!this.toggle)
				return;
			
			this.toggle.link.textContent = this.opts.enabled ? "on" : "off";
			this.on = this.opts.enabled ? 1 : 0;
			dojo.toggleClass(this.domNode, "bldEnabled", (this.opts.enabled ? true : false));
		},
		renderLinks: function(){
			
			var th = this;
			this.toggle = this.addLink( this.opts.enabled ? "on" : "off",
				function(){
					this.opts.enabled = !this.opts.enabled;
					th.on = this.opts.enabled ? 1 : 0;
				}, true	//use | break
			);
			dojo.toggleClass(this.domNode, "bldEnabled", (this.opts.enabled ? true : false));

		},
		
	});

	dojo.declare("com.nuclearunicorn.game.ui.tab.Steambot", com.nuclearunicorn.game.ui.tab, {
		render: function(content){
			
			var keylist = Object.keys(sengine.kittenStorage.steamgui);
			for (var i = 0; i < keylist.length; ++i) {
				var data = sengine.kittenStorage.steamgui[keylist[i]];
				data.id = keylist[i];
				
				var databtn = new com.nuclearunicorn.game.ui.OptionModern(data, game);
			
				databtn.render(content);
			}
			return;

			var div = dojo.create("div", {
				style: {
					paddingBottom : "5px",
					marginBottom: "15px",
					borderBottom: "1px solid gray"
				}
			}, content);
		
			
			dojo.forEach(sengine.kittenStorage.steamgui, function(opti, i){
				
				opti.visible = true;
				opti.handler = function() { opti.enabled = !opti.enabled; };
				var btn = new classes.ui.btn.ButtonModern(opti, game);
				console.log(btn);
				btn.setEnabled(true);
				btn.setVisible(true);
				btn.render(div);
				this.addButton(btn);
			});
			
		}
	});

	// Core style and basic setup
	// ====================

	SteamEngine.prototype = {
		
		getName: function(name) {
			if (name == 'catpower') name = 'manpower';
			if (name == 'compendium') name = 'compedium';
			if (name == 'concrete') name = 'concrate';
			return name;
		},
		
		getRes: function(name) {
			
			name = this.getName(name);
			
			if (this.res_lookup[name] === false)
				return false;
			var i = this.res_lookup[name];
			if (!game.resPool.resources[i])
				return false;
		
			return game.resPool.resources[i];
			
		},
		
		/*
			return the side panel
		*/
		getResRow: function(name) {
			
			name = this.getName(name);
			
			if (!this.craft_lookup[name])
				return false;
			return this.craft_lookup[name];
		},
		
		
		pagetoreturn_to: 'Bonfire',
		
		init: function() {
			
			var $doc = $(document);
			
			// unhook previous events
			$doc.off('click','.tabsContainer a')
				.off('click','.resourceRow td:first-child')
				.off('click','.resourceRow td:nth-child(2)');
			
			// make sure added tab can be clicked
			$('#rightColumn')
				.css('padding-top','0px')
				.css('margin-top','20px');
			
			this.loadFromKittenStorage();
			
			setTimeout(function() {
				console.log('hooking click event');
				$doc.on('click','.tabsContainer a', function(ev) {
					var page = this.textContent;
					console.log('moving to page ',page);
					if (!pageaction_addbuttons[page]) 
						return;
					sengine.pagetoreturn_to = page;
					setTimeout(pageaction_addbuttons[page], 350);
					
				});
			}, 400);
			
			if ($('#magicactivity').length == 0) {
				$('#saveTooltip').after('<a id="magicactivity" href="#" onclick="sengine.activity.displayActivitySummary()">Activity</a> |');
			}

			

			$doc.on('click','.resourceRow td:first-child', function() {
				var t = $(this).text(); // get resource name
				t = t.substr(0, t.length -1);  // remove :
				var res = sengine.getRes(t);
				if (!res.craftable && sengine.getResRow(t) === false) return;
				if (!sengine.kittenStorage.craftingtoggles[res.name]) return;
				var crafttoggle = sengine.kittenStorage.craftingtoggles[res.name];
				crafttoggle.enabled = !crafttoggle.enabled;
				
				dojo.setStyle(this, 'border-bottom', '1px solid ' + (crafttoggle.enabled ? 'green' : 'transparent'));
				
				var f = crafttoggle.enabled ? toggleon : toggleoff;
				f('Crafting '  + (res.title ? res.title : res.name) +  (crafttoggle.enabled ? ' Enabled' : ' Disabled'));
		
				sengine.saveToKittenStorage();
				
			});
			$doc.on('click','.resourceRow td:nth-child(2)', function() {
				var kids = $(this).parent().children();
				var t = $(kids[0]).text();
				
				//var t = $(this).text(); // get resource name
				t = t.substr(0, t.length -1);  // remove :
				var res = sengine.getRes(t);
				if (!res.craftable && sengine.getResRow(t) === false) return;
				if (!sengine.kittenStorage.craftingtoggles[res.name]) return;
				var crafttoggle = sengine.kittenStorage.craftingtoggles[res.name];
				
				$(kids[1 + crafttoggle.craftindex]).css('border-bottom', '1px solid transparent');
				
				if (!crafttoggle.enabled)
					return;
				
				if (crafttoggle.craftindex == 4)
					crafttoggle.craftindex = 1;
				else
					crafttoggle.craftindex++;
				console.log(kids[1 + crafttoggle]);
				$(kids[1 + crafttoggle.craftindex]).css('border-bottom', '1px solid green');
				sengine.saveToKittenStorage();
				
			});
			
				
			if (typeof sengine.kittenStorage.traders == 'undefined')
				sengine.kittenStorage.traders = {};	
			
			for (var i = 0; i < gamePage.diplomacy.races.length; ++i) {
				
				var race = gamePage.diplomacy.races[i];
				if (!race) continue;
				
				if (sengine.kittenStorage.traders[race.name])
					continue;
				
				sengine.kittenStorage.traders[race.name] = {
					name: race.name,
					enabled: true
				};
			}
				
			
			if (!sengine.kittenStorage.steamgui.removeextracolors) {
				
				/* special resources are not styled */
				sengine.kittenStorage.steamgui.removeextracolors = {
					prices: [],
					flavor: 'monkeys like it',
					handler: function() {
						sengine.kittenStorage.steamgui.removeextracolors.enabled = !sengine.kittenStorage.steamgui.removeextracolors.enabled;
						
						sengine.saveToKittenStorage();
					},
					togglable: true,
					enabled: true,
					description: 'special resources are not styled - rainbow toggle - requires refresh',
					name: 'Dull gray world'
				};
			}
			
			this.res_lookup = {};
			for (var i = 0; i < game.resPool.resources.length; ++i)  {
				var res = game.resPool.resources[i];
				
				this.res_lookup[res.name] = i;
				var tunedata = {
					min: 1
				}
				if (!sengine.kittenStorage.tuning[res.name])
					sengine.kittenStorage.tuning[res.name] = tunedata;
				
				// beleive this is a style thing only...
				// i could be wrong *shrugs*
				// the other problem is, the only way to get this data back is to refresh the page...
				// maybe there should be a data store....
				if (sengine.kittenStorage.steamgui.removeextracolors.enabled) {
					res.color = '';
					// turns out you need this for happiness
					//res.type = 'common';
				}
				
			}
			
			this.craft_lookup = {};
			for (var i = 0; i < gamePage.craftTable.resRows.length; ++i) {
				var rrow = gamePage.craftTable.resRows[i];
				var res = rrow.resRef;
				this.craft_lookup[res.name] = rrow;
			}
				
			
			if (!sengine.kittenStorage.steamgui.dimnonproducingcappedresources) {
					
				sengine.kittenStorage.steamgui.dimnonproducingcappedresources = {
					prices: [],
					flavor: 'monkeys like it',
					handler: function() {
						sengine.kittenStorage.steamgui.dimnonproducingcappedresources.enabled = !sengine.kittenStorage.steamgui.dimnonproducingcappedresources.enabled;
						
						sengine.saveToKittenStorage();
					},
					togglable: true,
					enabled: true,
					description: 'Dim resources that are at cap, but have no generation',
					name: 'Dim capped resources'
				};
			}
			
			if (!sengine.kittenStorage.steamgui.dimlimitlessresources) {
				
				/* resources without a cap will gray */
				sengine.kittenStorage.steamgui.dimlimitlessresources = {
					prices: [],
					flavor: 'monkeys like it',
					handler: function() {
						sengine.kittenStorage.steamgui.dimlimitlessresources.enabled = !sengine.kittenStorage.steamgui.dimlimitlessresources.enabled;
						$('#resContainer .limited').removeClass('limited');
						sengine.saveToKittenStorage();
					},
					togglable: true,
					enabled: true,
					description: 'resources without a cap will gray',
					name: 'Dim unlimited resources'
				};
			}
			
			
			/* showing + or - for catnip production */
			if (!sengine.kittenStorage.steamgui.showweathermodifier) {
				sengine.kittenStorage.steamgui.showweathermodifier = {
					prices: [],
					flavor: 'monkeys like it',
					handler: function() {
						sengine.kittenStorage.steamgui.showweathermodifier.enabled = !sengine.kittenStorage.steamgui.showweathermodifier.enabled;
						//console.log(sengine.kittenStorage.steamgui.showweathermodifier.enabled);
					},
					togglable: true,
					enabled: false,
					description: 'showing + or - percents for catnip production',
					name: 'Show weather modifier'
				};
			}
			
			if (!game.steambotTab) {
				game.steambotTab = new com.nuclearunicorn.game.ui.tab.Steambot("Steambot", game);
				game.steambotTab.visible = true;
				game.addTab(game.steambotTab);
			}
			
			/**
			 * This section is performance-critical. Using non vanilla js here is a very *BAD* idea.
			 * Okay, so personally i have some issues with the coloring, and am not sure how often the dom is overwritten
			 * so some tweaks to fix my color issues, and possibly* speed it up
			 * * not sure
			 */
			gamePage.resTable.update = function(){
				var reqRes = this.game.getRequiredResources(this.game.selectedBuilding);
				for (var i = 0; i < this.resRows.length; i++){
					var row = this.resRows[i];
					var res = row.resRef;

					var isVisible = (res.value > 0 || (res.name == "kittens" && res.maxValue));
					var isHidden = (row.rowRef.style.display === "none");
					if (isHidden && !isVisible){
						continue;
					}else if(isHidden && isVisible){
						row.rowRef.style.display = "";
					}
					
					
					var perTick = this.game.opts.usePerSecondValues ? res.perTickUI * this.game.rate : res.perTickUI;
					var postfix = this.game.opts.usePerSecondValues ? "/sec" : "";
					if (this.game.opts.usePercentageResourceValues && res.maxValue){
						perTick = perTick / res.maxValue * 100;
						postfix = "%" + postfix;
					}

					var perTickValue = perTick ? "(" + this.game.getDisplayValueExt(perTick, true, false) + postfix + ")" : "";
					if (row.resTick.textContent != perTickValue)
						row.resTick.textContent = perTickValue;

					var className;
					//  highlight resources for selected building
					//--------------------------------------------
					if (reqRes.indexOf(res.name) >= 0){
						className = "resourceRow highlited " + res.name;
					} else {
						className = "resourceRow " + res.name;
					}
					if (row.rowRef.className != className){	//surprisingly, this check makes setClass ~50% faster
						// it becomes faster because updating the dom takes a crap ton of time
						// so if its already set to what you want, dont change it.
						row.rowRef.className = className;
					}

					//---------------------------------------------

					row.resAmt.textContent = this.game.getDisplayValueExt(res.value);
					
					var skipstyle = sengine.kittenStorage.steamgui.dimlimitlessresources.enabled && res.maxValue == 0;
					var hitmax = res.maxValue > 0 && res.value > res.maxValue * 0.99875; /* .999 is too much */
					var nearmax = res.value > res.maxValue * .95;
					res.ResHitMax = hitmax;
					res.NearMax = nearmax;
					var styletitle = '';
					
					
					if (hitmax && sengine.kittenStorage.steamgui.dimnonproducingcappedresources.enabled) {
						if (perTick) {
							styletitle = "limited";
							skipstyle = false;
						}
					}else if (nearmax){
						//rowClass += " resLimitNotice";
						styletitle =  "resLimitNotice";
					} else if (res.value > res.maxValue * 0.75){
						styletitle = "resLimitWarn";
					} else if (row.resAmt.className){
						styletitle = "";
					}
					
					if (!skipstyle && row.resAmt.className != styletitle) {
						row.resAmt.className = styletitle;
					}


					var maxResValue = res.maxValue ? "/" + this.game.getDisplayValueExt(res.maxValue) : "";
					if (row.resMax.textContent != maxResValue)
						row.resMax.textContent = maxResValue;
				
					

					
					if ((sengine.kittenStorage.steamgui.dimnonproducingcappedresources.enabled && hitmax) || res.maxValue == 0) {
						
						if (perTick && res.maxValue > 0) {
							if (row.resTick.parentNode.className.indexOf('limited') == -1)
								row.resTick.parentNode.className = row.resTick.parentNode.className + ' limited';
						} else {
							if (row.resTick.parentNode.className.indexOf('disabled') == -1)
								row.resTick.parentNode.className = row.resTick.parentNode.className + ' disabled';
							
						}
					}

					if (row.resTick.style.cursor != (res.perTickUI ? "pointer" : "default"))
						row.resTick.style.cursor = res.perTickUI ? "pointer" : "default";

					// my personal issues, i hate the weather modifier
					// but im guessing other people like it, so theres an option for it.
					if (!sengine.kittenStorage.steamgui.showweathermodifier.enabled)
						continue;
					
					//weather mod
					var season = this.game.calendar.getCurSeason();
					if (season.modifiers[res.name] && res.perTickUI != 0 ){

						var modifier = (season.modifiers[res.name] + this.game.calendar.getWeatherMod() - 1)*100;
						row.resWMod.textContent = modifier ? "[" + (modifier > 0 ? "+" : "") + modifier.toFixed() + "%]" : "";

						if (modifier > 0){
							dojo.setStyle(row.resWMod, "color", "green");
						}else if (modifier < 0){
							dojo.setStyle(row.resWMod, "color", "red");
						} else {
							if (row.resWMod.style.color != "black"){
								row.resWMod.style.color = "black";
							}
						}
					}
					
				}
			};
				
				
			if (!hijackedresourcerender) {
				hijackedresourcerender = true;
				/*
				var realrender = gamePage.craftTable.render;
				this.resRows = gamePage.craftTable.resRows;
				this.containerId = gamePage.craftTable.containerId;
				this.game = gamePage;
				this.getResourceCraftRatio = gamePage.craftTable.getResourceCraftRatio;
				gamePage.craftTable.render = function() {
					// we still have to do the normal stuff	
					realrender();
					
					// add sweet toggles and colors! and rainbows, and ponies, and bronies
					console.log('rendered ');
				}
				*/
				gamePage.craftTable.render = function(){
					if (!this.containerId) { throw "container id is undefined for res table"; }
					dojo.empty(this.containerId);

					this.resRows = [];

					var resTable = dojo.create("table", { className: "table resTable craftTable", style: { width: "100%"} }, this.containerId);

					for (var i = 0; i < this.game.resPool.resources.length; i++){
						var res = this.game.resPool.resources[i];

						if (!res.craftable){
							continue;
						}

						var craftRatio = this.getResourceCraftRatio(res);

						//sort of hack to override regeneration bug
						var recipe = this.game.workshop.getCraft(res.name);

						//self-recovery hack to discard removed resources
						//TODO: remove the reference from the res pool
						if (!recipe){
							res.value = 0;
							continue;
						}
						
						var crafttoggle = sengine.kittenStorage.craftingtoggles[res.name] ? sengine.kittenStorage.craftingtoggles[res.name] : false;
						//console.log(res.name, crafttoggle);
						
						// add the res name to the class
						var tr = dojo.create("tr", { class: "resourceRow " + res.name }, resTable);

						var isVisible = (recipe.unlocked && res.value > 0 && this.workshop.val > 0);
						dojo.setStyle(tr, "display", isVisible ? "" : "none");
						//	---------------- name ----------------------

						var tdResName = dojo.create("td", {
								innerHTML: (res.title || res.name) + ":",
								style: {
									width: "75px"
								}
							}, tr);
						if (res.color){
							dojo.setStyle(tdResName, "color", res.color);
						}
						// always put the border up
						dojo.setStyle(tdResName, 'border-bottom', '1px solid ' + (crafttoggle && crafttoggle.enabled ? 'green' : 'transparent'));

						//	---------------- amt ----------------------
						var tdAmt = dojo.create("td", null, tr);
						tdAmt.textContent = this.game.getDisplayValueExt(res.value);

						//	---------------- + ----------------------

						var a1 = this.createCraftButton(tr, recipe, craftRatio, res, 1, 0.01);
						var a25 = this.createCraftButton(tr, recipe, craftRatio, res, 25, 0.05);
						var a100 = this.createCraftButton(tr, recipe, craftRatio, res, 100, 0.1);
						//	---------------- +all ----------------------
						var td = dojo.create("td", { }, tr);
						var aAll = dojo.create("a", {
							href: "#",
							innerHTML : "all",
							style: {
								display: this.hasMinAmt(recipe) ? "" : "none"
							}
						}, td);
						dojo.connect(aAll, "onclick", this, dojo.partial(function(res, event){
							this.game.craftAll(res.name);
							event.preventDefault();
						}, res));
						//	---------------- + end all ----------------------
						
						$(a1).parent().css('border-bottom','1px solid ' + (crafttoggle.craftindex == 1 ? 'green' : 'transparent'));
						$(a25).parent().css('border-bottom','1px solid ' + (crafttoggle.craftindex == 2 ? 'green' : 'transparent'));
						$(a100).parent().css('border-bottom','1px solid ' + (crafttoggle.craftindex == 3 ? 'green' : 'transparent'));
						$(aAll).parent().css('border-bottom','1px solid ' + (crafttoggle.craftindex == 4 ? 'green' : 'transparent'));
						

					

						this.resRows.push({
							resRef: res,
							recipeRef: recipe,
							rowRef: tr,
							resAmt : tdAmt,
							a1 : a1,
							a25: a25,
							a100: a100,
							aAll: aAll
						});
					}
				};
				
			}
			sengine.addTimedEvent('ResetFaith', 1000 * 60 * 15, function() {
				
				if (!sengine.kittenStorage.steamgui.resetfaith) {
					sengine.kittenStorage.steamgui.resetfaith = {
						prices: [],
						flavor: 'Make em, Make em, Make em.',
						handler: function() {
							sengine.kittenStorage.steamgui.resetfaith.enabled = !sengine.kittenStorage.steamgui.resetfaith.enabled;		
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: false,
						description: 'Reset faith',
						name: 'Faith Reset'
					}
				}
				// global toggle
				if (!sengine.kittenStorage.steamgui.resetfaith.enabled)
					return;
				
				if (!gamePage.religion.getRU("apocripha").researched){
					return;	//trust no one
				}

				activity('Reset religion (Faith Bot)');
				gamePage.religionTab.resetFaithInternal(1.01)
						
			});
			
			sengine.addTimedEvent('PromoteLeader', 30000, function() {
				
				if (!sengine.kittenStorage.steamgui.autopromote) {
					sengine.kittenStorage.steamgui.autopromote = {
						prices: [],
						flavor: 'You are better faster mouser',
						handler: function() {
							sengine.kittenStorage.steamgui.autopromote.enabled = !sengine.kittenStorage.steamgui.autopromote.enabled;		
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: false,
						description: 'Should auto promote the leader if you have one',
						name: 'Promote Leader'
					}
				}
				// global toggle
				if (!sengine.kittenStorage.steamgui.autopromote.enabled)
					return;
				/*
				// good test
				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=
				// this is pretty ulgy right now...
				var leader = this.game.village.leader;
				var gold = this.game.resPool.get("gold");
				if (leader) {
					var expToPromote = this.game.village.getRankExp(leader.rank);
					var goldToPromote = 25 * (leader.rank + 1);
					this.promoteLeaderHref = dojo.create("a", {
						href: "#", innerHTML: "Promote (" + this.game.getDisplayValueExt(expToPromote.toFixed()) + " exp, " + goldToPromote + " gold)",
						style: {
							display:
								(leader.exp < expToPromote || gold.value < goldToPromote) ? "none" : "block"
						}
					}, this.governmentDiv);

					dojo.connect(this.promoteLeaderHref, "onclick", this, dojo.partial(function(census, leader, event){
						event.preventDefault();
						var game = census.game;

						if (leader.exp >= game.village.getRankExp(leader.rank) && gold.value > goldToPromote){
							leader.exp -= game.village.getRankExp(leader.rank);
							gold.value -= goldToPromote;
							leader.rank++;
						}
						census.renderGovernment(census.container);
						census.update();

					}, this, leader));
				}
						*/
			});
			
			// auto workshop buy
			sengine.addTimedEvent('Workshop', 5000, function() {
				if (!sengine.kittenStorage.steamgui.autoworkshop) {
					sengine.kittenStorage.steamgui.autoworkshop = {
						prices: [],
						flavor: 'work party!',
						handler: function() {
							sengine.kittenStorage.steamgui.autoworkshop.enabled = !sengine.kittenStorage.steamgui.autoworkshop.enabled;		
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: false,
						description: 'The attempt to auto buy from the workshop tab',
						name: 'Workshop Bot'
					}
				}
				// global toggle
				if (!sengine.kittenStorage.steamgui.autoworkshop.enabled)
					return;
				if (typeof gamePage.workshopTab == 'undefined')
					return;
				
				for (var i = 0; i < gamePage.workshop.meta[0].meta.length; ++i) {
					
					var shop = gamePage.workshop.meta[0].meta[i];
					
					if (!shop.unlocked || shop.researched)
						continue; 
					
					if (!shop.prices) {
						shop.prices = [{
							name:"science",
							val: shop.cost
						}];
					}
					
					if (!gamePage.resPool.hasRes(shop.prices))
						continue;
					
					if (sengine.kittenStorage.workshoptoggles[shop.name] &&
						!sengine.kittenStorage.workshoptoggles[shop.name].enabled)
						continue;
					
					gamePage.resPool.payPrices(shop.prices);
					
					var btn = gamePage.workshopTab.createBtn(shop);
					btn.handler(btn);
					
					activity('Workshop upgrade ' + shop.title);
					sengine.activity.storeForSummary(shop.title, 1, 'workshop');
					
				}
				
				
			});
			// auto science buy
			sengine.addTimedEvent('Science', 5000, function() {
				if (!sengine.kittenStorage.steamgui.autoscience) {
					sengine.kittenStorage.steamgui.autoscience = {
						prices: [],
						flavor: 'Dance party',
						handler: function() {
							sengine.kittenStorage.steamgui.autoscience.enabled = !sengine.kittenStorage.steamgui.autoscience.enabled;		
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: false,
						description: 'The attempt to auto buy from the science tab',
						name: 'Research Bot'
					}
				}
				// global toggle
				if (!sengine.kittenStorage.steamgui.autoscience.enabled)
					return;
				
				
				var sciencestypes = Object.keys(gamePage.science.metaCache);
				for (var i = 0; i < sciencestypes.length; ++i) { 
					var tech = gamePage.science.metaCache[sciencestypes[i]]; 
					if (!tech.unlocked || tech.researched)
						continue; 
					
					if (!tech.prices) {
						tech.prices = [{
							name:"science",
							val: tech.cost
						}];
					}
					
					if (!gamePage.resPool.hasRes(tech.prices))
						continue;
				
					
					gamePage.resPool.payPrices(tech.prices);
					tech.researched = true;

					gamePage.unlock(tech.unlocks);

					if (tech.upgrades) gamePage.upgrade(tech.upgrades);
					
					activity('Bought science ' + tech.title);
					sengine.activity.storeForSummary(tech.title, 1, 'research');
					return;
				}
			});
			
			
			sengine.addTimedEvent('SuperCompendium', 1000, function() {
				
				if (!sengine.kittenStorage.steamgui.supercompendium) {
					sengine.kittenStorage.steamgui.supercompendium = {
						prices: [],
						flavor: 'Make em, Make em, Make em.',
						handler: function() {
							sengine.kittenStorage.steamgui.supercompendium.enabled = !sengine.kittenStorage.steamgui.supercompendium.enabled;		
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: false,
						description: 'Make all the compendiums',
						name: 'Science Bot'
					}
				}
				// global toggle
				if (!sengine.kittenStorage.steamgui.supercompendium.enabled)
					return;
				
				var culture = sengine.getRes('culture');
				var parchment = sengine.getRes('parchment');
				var manuscript = sengine.getResRow('manuscript');
				if (culture.ResHitMax  && 
					(Math.ceil(culture.maxValue / 400 ) * 25 < parchment.value - 2500) &&
					sengine.kittenStorage.craftingtoggles.manuscript.enabled &&
					manuscript.aAll.style.display == "") {
				
					var v = manuscript.resRef.value;
					manuscript.aAll.click();
					var made = manuscript.resRef.value - v;
					sengine.activity.storeForSummary('manuscript', made, 'craft');
					
					activity('Make all manuscripts (Science Bot)');
				}
				
				var science = sengine.getRes('science');
				var has_drama = gamePage.science.get('drama').researched;
					var compendium = sengine.getResRow('compendium');
				if (science.ResHitMax &&
					(has_drama || manuscript.resRef.value > 5000) &&
					sengine.kittenStorage.craftingtoggles.compedium.enabled &&
					compendium.aAll.style.display == "") {
					var v = compendium.resRef.value;
					compendium.aAll.click();
					var made = compendium.resRef.value - v;
					sengine.activity.storeForSummary('compendium', made, 'craft');
					activity('Make all compendiums (Science Bot)');
				}
				
			});
				
			sengine.addTimedEvent('SteamSave', 5000, sengine.saveToKittenStorage);
			
			// Auto hunt 
			sengine.addTimedEvent('KittenWarriors', 1000, function() {
				
				if (!sengine.kittenStorage.steamgui.autohunt) {
					sengine.kittenStorage.steamgui.autohunt = {
						prices: [],
						flavor: 'kitten death squads',
						handler: function() {
							sengine.kittenStorage.steamgui.autohunt.enabled = !sengine.kittenStorage.steamgui.autohunt.enabled;		
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: true,
						description: 'send the kitten guards to kill the filthy mice.',
						name: 'Auto hunting'
					}
				}
				// global toggle
				if (!sengine.kittenStorage.steamgui.autohunt.enabled)
					return;
				/* Do we care how much hunters gathered? it would be easy
				var current = {};
				for (var item in ['furs','spice','ivory','unicorns'])
					current[item] = engine.getRes('furs').value;*/
				
				var cp = sengine.getRes('catpower');
				var gold = sengine.getRes('gold');
				if (cp.ResHitMax || (gold.ResHitMax && cp.value > cp.maxValue * .8)) {
					
					var amounttosend = Math.floor(cp.value / 100);
					sengine.activity.storeForSummary('hunt', amounttosend);
					gamePage.village.huntAll();
					
					sengine.getRes('catpower').lasttrade = 0;
				}
				
				/*
				if (!cp || cp.value < (cp.maxValue * .95))
					return;
				var amttosend = 1;
				if (cp.maxValue > 1000) {
					// the value should be in an option
					var m = cp.maxValue * .4;
					amttosend = Math.floor(m / 100);
				}
				if (amttosend <= 0)
					return;
				
				var amounttosend = amttosend * 1000;
				var amounttoreset = cp.value - amounttosend;
				cp.value = amounttosend;
				gamePage.village.huntAll();
				cp.value = amounttoreset;
				sengine.activity.storeForSummary('hunt', amttosend);
				*/
			
			});
			
			// festival
			sengine.addTimedEvent('festivals', 6000, function() {
				
				
				if (!sengine.kittenStorage.steamgui.autofestival) {
					/* global toggle for festivals */
					sengine.kittenStorage.steamgui.autofestival = {
						prices: [],
						flavor: 'dance like a muscular horn',
						handler: function() {
							sengine.kittenStorage.steamgui.autofestival.enabled = !sengine.kittenStorage.steamgui.autofestival.enabled;
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: true,
						description: 'all the thing workshop items get crafted.',
						name: 'Festivals'
					}
				}
				
				
				// global toggle
				if (!sengine.kittenStorage.steamgui.autofestival.enabled)
					return;
				
				if (!gamePage.science.get('drama').researched)
					return;
				
				var parchment = sengine.getRes('parchment');
				var catpower = sengine.getRes('catpower');
				
				if (!parchment ||
					parchment.value < 2500 ||
					catpower.value < 1500 ||
					gamePage.calendar.festivalDays > 0) return;
			
				// handle prices accordingly
				var villageManager = new TabManager('Small village');
				villageManager.tab.festivalBtn.onClick();
			
				sengine.activity.storeForSummary('festival');
				activity('Kittens begin holding a festival');
				

			});
			
			// autocrafting 
			sengine.addTimedEvent('autocrafting', 1000, function() {
				
				
				if (!sengine.kittenStorage.steamgui.autocrafting) {
					/* global toggle for crafting */
					sengine.kittenStorage.steamgui.autocrafting = {
						prices: [],
						flavor: 'all the things',
						handler: function() {
							sengine.kittenStorage.steamgui.autocrafting.enabled = !sengine.kittenStorage.steamgui.autocrafting.enabled;
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: true,
						description: 'all the thing workshop items get crafted.',
						name: 'Steam Autocrafting'
					}
				}
				if (!sengine.kittenStorage.steamgui.autotemple) {
					/* global toggle for crafting */
					sengine.kittenStorage.steamgui.autotemple = {
						prices: [],
						flavor: 'toggle manuscripts on off for temple',
						handler: function() {
							sengine.kittenStorage.steamgui.autotemple.enabled = !sengine.kittenStorage.steamgui.autotemple.enabled;
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: true,
						description: 'toggle manuscripts on off for temple.',
						name: 'Magic Temple Manuscripts'
					}
				}
				if (!sengine.kittenStorage.steamgui.autochapel) {
					/* global toggle for crafting */
					sengine.kittenStorage.steamgui.autochapel = {
						prices: [],
						flavor: 'toggle parchments on off for chapel',
						handler: function() {
							sengine.kittenStorage.steamgui.autotemple.enabled = !sengine.kittenStorage.steamgui.autotemple.enabled;
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: true,
						description: 'toggle parchments on off for chapel',
						name: 'Magic Chapel Parchements'
					}
				}
				
				
				// global toggle
				if (!sengine.kittenStorage.steamgui.autocrafting.enabled)
					return;
				var hasWorkshops = gamePage.bld.metaCache.workshop.meta.val > 0;
				if (!hasWorkshops)
					return;
				
				for (var craftindex in game.workshop.crafts) {
					
					var craftitem = game.workshop.crafts[craftindex],
						resname = craftitem.name;
					var debug = false;
					//var debug = resname == 'compedium';
					console.log(resname);
					var resrow = this.getResRow(resname);	
					
					// once all the things are loaded we need to establish if we have reference to crafting recipes
					// if we do then we loaded them from storage, otherwise we have to add them.
					var rec = resrow.recipeRef;
					// make sure this item is the in a setup that can be changed
					if (rec && !sengine.kittenStorage.craftingtoggles[resname]) {
							
						//console.log('adding toggle ' + resname);
						//console.log(resrow.resRef.name, resname, rec, resrow);
					
						//console.log('adding details ' + craftitem.name, craftitem.toggle);
						var steamcraft = {
							prices: [],
							//flavor: 'all the things',
							handler: function() {
								this.enabled = !this.enabled;
								
							},
							cost: {},
							// record of amounts we previously had
							previous: false,
							togglable: true,
							enabled: true,
							craftindex: 1,
							description: 'Auto make ' + rec.name,
							name: rec.name + ' Auto'
						};
						for (var mx = 0; mx < rec.prices.length; ++mx) {
							var pc = rec.prices[mx];
							steamcraft.cost[pc.name] = pc.val * 2.5;
						}
						sengine.kittenStorage.craftingtoggles[resname] = steamcraft;
						
					}
					
					var craftdata = sengine.kittenStorage.craftingtoggles[resname];
					if (!craftdata.minimum)
						craftdata.minimum = 0;
					
					if (!craftdata.enabled) {
						if (debug) console.log('craft not enabled' + resname);
							continue;
					}
					
					if (!craftitem.unlocked) {
						if (debug) console.log('not unlocked ' + resname);
						continue;
					}
					
					if (!resrow.resRef || !resrow.resRef.craftable ){
						
						if (debug) console.log('errr ', resname, resrow);
						continue;
					}
					
					if ($(craftitem.a1).css('display') == 'none') {
						if (debug) console.log('not visible ' + resname);
						continue;
					}
					if (!craftdata.craftindex)
						craftdata.craftindex = 1;
					
					// currently we dont do index 4, which is all, not sure how to read the cap or amount.
					var content = resrow.a1;
					if (craftdata.craftindex == 2)
						content = resrow.a25;
					if (craftdata.craftindex == 3)
						content = resrow.a100;
					if (craftdata.craftindex == 4)
						content = resrow.aAll;
					
					var amount_that_is_made = gamePage.getResCraftRatio({name:resname}) + 1;
					
					var amt_to_make = craftdata.craftindex == 4 ? false : parseInt(content.textContent);
					
					// we can make all, but we dont know what that is
					// the smallest dividable amount of the resources we have.
					if (amt_to_make === false) {
						
						var can_make_amount = false;
						for (var ix in craftitem.prices) {
							var price = craftitem.prices[ix];
							//console.log('foo',price);
							// record the acutal amount we have, before we make it.
							var costres = sengine.getRes(price.name);
							var cost_for_one = price.val;
							if (costres.value < cost_for_one) {
								if (debug) console.log('not making (current/for one) ', resname, costres.value, cost_for_one);
								continue;
							}
							
							var can_make_amt = Math.floor(costres.value / cost_for_one);
							if (can_make_amount === false || can_make_amount > can_make_amt)
								can_make_amount = can_make_amt;
						}
						if (can_make_amount === false)
							continue;
						amt_to_make = can_make_amount * amount_that_is_made;
						if (debug) console.log('making all should result in  ', resname, amt_to_make);
					}
					
					var resultamt = amt_to_make + resrow.resRef.value;
					
					amt_to_make = parseFloat((amt_to_make / amount_that_is_made).toFixed(1));
					if (debug) console.log(resname + ' should make ' + amt_to_make.toFixed(2), amount_that_is_made);
					
					
					/*
					wood should make 49.00
					beam should make 14.00
					slab should make 14.00
					concrete should make 4.00
					plate should make 4.00
					steel should make 4.00
					alloy should make 4.00
					gear should make 4.00
					parchment should make 4.00
					manuscript should make 4.00
					compendium should make 4.00
					blueprint should make 4.00
					scaffold should make 4.00
					ship should make 4.00
					tanker should make 4.00
					megalith should make 4.00 */

					
					// dont make more then we need
					if (resrow.resRef.maxValue > 0 && resultamt >= resrow.resRef.maxValue)  {
						
						if (debug) console.log('making would overflow pot ' + resname);
						continue;
					}
					
					
					var makeresource = true;
					
					if (resrow.resRef.value == 0) {
						
						 // if we have a record of a old value
					} else if (craftdata.previous) {
						if (debug) console.log('previous record ' + resname, craftdata.previous);
						// check each craft resouce to make a gear / key == steel
						for (var key in craftdata.previous){	
							var craftresitem = sengine.getRes(key);
							// if we dont have that resource steel (key) continue;
							if (!craftresitem) {
								makeresource = false;
								if (debug) console.log('no craft ' + resname);
								continue;
								}
						
							
							
							if (sengine.kittenStorage.tuning[key]) {
								var tunedata = sengine.kittenStorage.tuning[key];
								if (craftresitem.value < tunedata.min) {
									makeresource = false;
									if (debug) console.log('min amount not matched ' + resname, tunedata.min);
								}
							}
							
							if (craftresitem.NearMax) {
								if (debug) console.log('Free pass for ' + craftresitem.name, ' almost max');
								continue;
							} 
							
							var halfprevious = craftdata.previous[key] * .50;
							
							if (craftresitem.value < craftdata.previous[key] &&
								craftresitem.value > halfprevious) {
								if (debug) console.log('min amount not met ' + key);
								makeresource = false;
								continue;
							}
							// if we suddenly spend a lot of the resource
							// reset the last known craft value to our current amount so it 
							// will continue to make
							if (craftresitem.value < halfprevious) {
								if (debug) console.log('less then half for ' + key);
								craftdata.previous[key] = craftresitem.value;
								makeresource = false;
								continue;
							}
							
							
						}	
					}	
					
					for (var key in craftdata.cost) {
						
						// record the acutal amount we have, before we make it.
						var costres = sengine.getRes(key);
						if (debug) console.log(resname, ' cost of ', key, costres.value, craftdata.cost[key], costres.value < craftdata.cost[key]);
						if (!costres) { 
							makeresource = false;
							console.log('no items for', resname, key);
							break;
						}
						
							if (debug) console.log(costres);
						if (costres.ResHitMax) {
							if (debug) console.log('cost item at max', costres.name);
							continue;
						}
						
						if (resrow.resRef.value > 0 &&
							(costres.value - craftdata.minimum) < (craftdata.cost[key]) * 2) {
								
							if (debug) console.log('cap min or value issues | resrow.resRef.value > 0 ', 
								resrow.resRef.value,
								(resrow.resRef.value > 0),
								' | (costres.value - craftdata.minimum) < (craftdata.cost[key]) * 2 | ',
								(costres.value - craftdata.minimum) < (craftdata.cost[key]) * 2,
								costres.value,
								craftdata.minimum,
								craftdata.cost[key] * 2,
								resname, 
								key);
							makeresource = false;
							break;
						}
					}

					if (!makeresource) {
						if (debug) console.log('not making  ' + resname);
						continue;
					}
					
					if (!gamePage.resPool.hasRes(craftitem.prices, amt_to_make)) {
						if (debug) console.log('not enuf stuff  ' + resname, craftitem.prices, amt_to_make);
						continue;
					}
					
					// reset all the data for gear
					craftdata.previous = {};
					// foreach price of gear (makeType)
					for (var key in craftdata.cost) {
						
						// record the acutal amount we have, before we make it.
						var costres = sengine.getRes(key);
						if (!costres) {
							if (debug) console.log('Missing cost item ' + key, resname);
							continue;
						}
						if (costres.value < craftdata.cost[key]) {

						}
						craftdata.previous[key] = costres.value;
						
					}		
					
					
					if (amt_to_make == 0)
						continue;
					if (debug && amt_to_make > 0 && amt_to_make < 1) {
						console.log('amount is off ', resname);
					}
					
					if (resname == 'manuscript' && sengine.kittenStorage.steamgui.autochapel) {
						var prices = gamePage.bld.getPrices('chapel'),
							can_build = true;
						for (var mi = 0; mi < prices.length; ++mi) {
							var rx = sengine.getRes(prices[mi].name);
							if (rx.maxValue && prices[mi].val > rx.maxValue) {
								can_build = false;
								break;
							}
						}
						if (can_build) {
							if (debug) console.log('not crafting manuscript chapel can be built');
							return;
						}
						
					}
					if (resname == 'compedium' && sengine.kittenStorage.steamgui.autotemple) {
						var prices = gamePage.bld.getPrices('temple'),
							can_build = true;
						for (var mi = 0; mi < prices.length; ++mi) {
							var rx = sengine.getRes(prices[mi].name);
							if (rx.maxValue && prices[mi].val > rx.maxValue) {
								can_build = false;
								break;
							}
						}
						if (can_build) {
							if (debug) console.log('not crafting compendium/compedium temple can be built');
							return;
						}
						
					}
					
					
					
					if (debug) console.log('making item ' + resname);
					var v = resrow.resRef.value;
					content.click();
					sengine.activity.storeForSummary(resname, resrow.resRef.value - v, 'craft');
					
				}
			});
			
			// trading
			sengine.addTimedEvent('trading', 3000, function() {
				
				
				if (!sengine.kittenStorage.steamgui.autotrade) {
					/* global toggle for festivals */
					sengine.kittenStorage.steamgui.autotrade = {
						prices: [],
						flavor: 'the bear then wanted a trade for his love',
						handler: function() {
							sengine.kittenStorage.steamgui.autotrade.enabled = !sengine.kittenStorage.steamgui.autotrade.enabled;
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: false,
						description: 'auto trade with the peeps.',
						name: 'Trading',
						catpowerratio: .05,
						goldratio: .7
					}
				}
				
				// global toggle
				if (!sengine.kittenStorage.steamgui.autotrade.enabled) 
					return;
				
				if (typeof sengine.kittenStorage.steamgui.autotrade.tradeamount == 'undefined')
					sengine.kittenStorage.steamgui.autotrade.tradeamount = 2;
				if (typeof sengine.kittenStorage.steamgui.autotrade.catpowerratio == 'undefined')
					sengine.kittenStorage.steamgui.autotrade.catpowerratio = .05;
				if (typeof sengine.kittenStorage.steamgui.autotrade.goldratio == 'undefined')
					sengine.kittenStorage.steamgui.autotrade.goldratio = .7;
						
						
				var catpowerres = sengine.getRes('catpower');
				if (!catpowerres || catpowerres.value < 2000)
					return;
				
				var catpowertospend = Math.min((catpowerres.value - 2000) / 50);
				
				
				var goldres = sengine.getRes('gold');
				if (!goldres || !goldres.visible) return;
				
				var keepamount = goldres.maxValue * sengine.kittenStorage.steamgui.autotrade.goldratio;
				if (goldres.value < keepamount)
					return;
				var amounttospend = (goldres.value - keepamount);
				var tradetimes = Math.min(Math.floor(amounttospend / 100), catpowertospend);
				
				if (tradetimes <= 0) {
					//console.log('no trade');
					return;
				}
				
				if (!catpowerres.lasttrade)
					catpowerres.lasttrade = 0;
				
				if (catpowerres.value < catpowerres.lasttrade + (catpowerres.maxValue * sengine.kittenStorage.steamgui.autotrade.catpowerratio))
					return;
				catpowerres.lasttrade = catpowerres.value;
				var tradewith = [];

				for (var i = 0; gamePage.diplomacy.races.length; ++i) {
					
					if (tradetimes <= 0)
						break;
					
					var race = gamePage.diplomacy.races[i];
					if (!race) break;
					
					if (!sengine.kittenStorage.traders[race.name].enabled || 
						!race.unlocked) 
						continue;
					

					var shouldbuy = true;
					var currenttradetimes = sengine.kittenStorage.steamgui.autotrade.tradeamount;
					for (var m = 0; m < race.buys.length; ++m) {

						var buyitemname = race.buys[0].name;
						var buyres = sengine.getRes(buyitemname);
						
						if (race.buys[0].val > buyres.value)
							shouldbuy = false;
						
						currenttradetimes = Math.min(currenttradetimes, Math.floor(buyres.value / race.buys[0].val));
						
						if (buyres.maxValue == 0)
							continue;
						
						if (buyres.value < buyres.maxValue * .88) 
							shouldbuy = false;
						
					}
					
					if (!shouldbuy) continue;
					
					// simple space checke
					
					var btn = new com.nuclearunicorn.game.ui.TradeButton({race: race}, gamePage);
					btn.tradeMultiple(currenttradetimes);
					tradetimes -= currenttradetimes;
					
					/*
					var btn = new com.nuclearunicorn.game.ui.TradeButton({race: race}, gamePage);
					var cantradetimes = 999999999999;
					for (var v = 0; v < race.sells.length; ++v) {
						
						var s = race.sells[i];
						var sellres = sengine.getRes(s.name);
						if (sellres.maxValue == 0)
							continue;
						var spaceleft = sellres.maxValue - sellres.value;
						var cantradetimesx = Math.floor(spaceleft / s.value);
						if (cantradetimes <= 0)
							continue;
						cantradetimes = Math.min(cantradetimes, cantradetimesx);
						
					}
					*/
					
				}
				
			});

		
			sengine.addTimedEvent('kittenjobs', 2000, function() {
				
				if (!sengine.kittenStorage.steamgui.assignjobs) {
					/* global toggle for crafting */
					sengine.kittenStorage.steamgui.assignjobs = {
						prices: [],
						flavor: 'will work for catnip',
						handler: function() {
							sengine.kittenStorage.steamgui.assignjobs.enabled = !sengine.kittenStorage.steamgui.assignjobs.enabled;
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: false,
						description: 'auto direct kittens.',
						name: 'Steam Kitten Jobs'
					}
				}
				
				
				// global toggle
				if (!sengine.kittenStorage.steamgui.assignjobs.enabled)
					return;
				
				if (gamePage.village.getFreeKittens() == 0)
					return;
				jobs = {};
				
				for (var i = 0; i < gamePage.village.jobs.length; ++i) {
					var job = gamePage.village.jobs[i]
					if (!job.unlocked) continue;
					
					jobs[job.name] = job;
					lastJob = job;
				}
				
				if (jobs.priest) {
					gamePage.village.assignJob(jobs.priest);
				} else {
					var items = Object.keys(jobs);
					var mx = Math.floor(Math.random() * items.length);
					gamePage.village.assignJob(jobs[items[mx]]);
				}
				gamePage.village.updateResourceProduction();
				/*
				return;
		
				kittenjobdebug = true;
				jobs = {};
				kittens = {};
				lastJob = false;
				
				for (var i = 0; i < gamePage.village.jobs.length; ++i) {
					var job = gamePage.village.jobs[i]
					if (!job.unlocked) continue;
					
					jobs[job.name] = job;
					lastJob = job;
				}
				
				for (var i = 0; i < gamePage.village.sim.kittens.length; ++i) {
					var kitten = gamePage.village.sim.kittens[i];
					if (!kitten.job) continue;
					if (!kittens[kitten.job])
						kittens[kitten.job] = [];
					kittens[kitten.job].push(kitten);
					
				}
				var currentjobkeys = Object.keys(kittens),
					maxjoblist = false;
				for (var i = 0; i < currentjobkeys.length; ++i) {
					var jobkey = currentjobkeys[i];
					if (jobkey == 'farmer')
						continue;
					if (!maxjoblist) {
						maxjoblist = kittens[jobkey];
					} else {
						if (kittens[jobkey].length > maxjoblist.length) {
							maxjoblist = kittens[jobkey];
						}
					}
				
				}
				var science = sengine.getRes('science');
				var kittenres = sengine.getRes('kittens');
				if (jobs.scholar) {
					if (science) {
						if (science.value >= science.maxValue && jobs.scholar.value > 0) {
							
							if (kittens.scholar && kittens.scholar.length > 0) {
								kittens.scholar[0].job = null;
								jobs.scholar.value --;
								gamePage.village.updateResourceProduction();
								if (kittenjobdebug) console.log('%c Removed kitten from scholar', 'background: #FFE600; ');
								return;
							}
						}
						if (science.value < (science.maxValue - 200) && jobs.scholar.value <= Math.floor(kittenres.maxValue * .1)) {
								if (kittenjobdebug) console.log('%c Removed kitten from ' + maxjoblist[0].job, 'background: #CECC15; ');
								jobs[maxjoblist[0].job].value --;
								maxjoblist[0].job = null;
								gamePage.village.updateResourceProduction();
								return;
						}
					}
				}
				
				if (gamePage.village.getFreeKittens() == 0)
					return;
			
				if (jobs.scholar && science.value < (science.maxValue - 200) && jobs.scholar.value <= Math.floor(kittenres.maxValue * .1)) {
					gamePage.village.assignJob(jobs.scholar);
					gamePage.village.updateResourceProduction();
					if (kittenjobdebug) console.log('%c Added kitten to scholar' , 'background: #C8F526; ');
					return;
				}
				
				if (jobs.farmer && jobs.farmer.value < 4) {
					gamePage.village.assignJob(jobs.farmer);
					gamePage.village.updateResourceProduction();
					if (kittenjobdebug) console.log('%c Added kitten to farmer' , 'background: #D4ED91; ');
					return;
				}
				
				if (jobs.miner && jobs.miner.value < Math.ceil(kittenres.maxValue * .13)) {
					gamePage.village.assignJob(jobs.miner);
					gamePage.village.updateResourceProduction();
					if (kittenjobdebug) console.log('%c Added kitten to miner' , 'background: #DFFFA5; ');
					return;
				}
				if (jobs.hunter && jobs.hunter.value < Math.ceil(kittenres.maxValue * .14)) {
					gamePage.village.assignJob(jobs.hunter);
					gamePage.village.updateResourceProduction();
					if (kittenjobdebug) console.log('%c Added kitten to hunter' , 'background: #FCFFF0; ');
					return;
				}
				if (jobs.woodcutter && jobs.woodcutter.value < Math.ceil(kittenres.maxValue * .13)) {
					gamePage.village.assignJob(jobs.woodcutter);
					gamePage.village.updateResourceProduction();
					if (kittenjobdebug) console.log('%c Added kitten to woodcutter' , 'background: #FC4FF0; ');
					return;
				}
				if (jobs.priest && jobs.priest.value < Math.ceil(kittenres.maxValue * .1)) {
					gamePage.village.assignJob(jobs.priest);
					gamePage.village.updateResourceProduction();
					if (kittenjobdebug) console.log('%c Added kitten to priest' , 'background: #A2BC13; ');
					return;
				}
				
				if (jobs.scholar && jobs.scholar.value < Math.ceil(kittenres.maxValue * .1) && science.value < (science.maxValue - 200)) {
					gamePage.village.assignJob(jobs.scholar);
					gamePage.village.updateResourceProduction();
					if (kittenjobdebug) console.log('%c Added kitten to scholar' , 'background: #EEEED1; ');
					return;
				}
				if (jobs.geologist && jobs.geologist.value < Math.ceil(kittenres.maxValue * .4)) {
					gamePage.village.assignJob(jobs.geologist);
					gamePage.village.updateResourceProduction();
					if (kittenjobdebug) console.log('%c Added kitten to geologist' , 'background: #A2BC13; ');
					return;
				}
				
				var underten = Math.floor(Math.random() * 10),
					job = 'woodcutter';
				if (jobs.hunter && underten >2 && underten  < 4)
					job = 'hunter';
				else if (jobs.miner && underten < 6)
					job = 'miner';
				else if (jobs.priest && underten < 8)
					job = 'priest';
				else  if (jobs.geologist)
					job = 'geologist';
				
				if (jobs[job]) {
					gamePage.village.assignJob(jobs[job]);
					gamePage.village.updateResourceProduction();
					if (kittenjobdebug) console.log('%c Added kitten to ' + job + ' random...', 'background: #CCCCCC; ');
					return;
				}
				*/
				
				
			}); // end kitten jobs
			
			sengine.addTimedEvent('unobtainiumproduction', 1000, function() {
				if (!sengine.kittenStorage.steamgui.autounobtainium) {
					/* global toggle for crafting */
					sengine.kittenStorage.steamgui.autounobtainium = {
						prices: [],
						flavor: 'magic moon missles',
						handler: function() {
							sengine.kittenStorage.steamgui.autounobtainium.enabled = !sengine.kittenStorage.steamgui.autounobtainium.enabled;
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: false,
						description: 'toggle lunaroutposts on and off.',
						name: 'Auto Unobtainium'
					}
				}
				// global toggle
				if (!sengine.kittenStorage.steamgui.autounobtainium.enabled)
					return;
				
				// wait for the user to manual load the tab...
				if (!gamePage.spaceTab || 
					typeof gamePage.spaceTab.planetPanels == 'undefined' ||
					gamePage.spaceTab.planetPanels.length == 0)
					return;
		
				
				var unob = sengine.getRes('unobtainium');
				if (!unob || !unob.visible) return;
				var uran = sengine.getRes('uranium');
				if (!uran || !uran.visible) return;
				
				var lunaroutpost = gamePage.spaceTab.planetPanels[0].planet.buildings[0];
				if (!lunaroutpost || !lunaroutpost.unlocked) return;
				
				if (unob.value >= unob.maxValue && lunaroutpost.on > 0) {
					
					lunaroutpost.on = 0;
					return;
				}
				
				if (uran.value < uran.maxValue * .1 && lunaroutpost.on > 0) {
					
					lunaroutpost.on = 0;
					return;
				}
				
				if ((uran.NearMax || uran.ResHitMax ) &&
					!unob.ResHitMax) {
						
					lunaroutpost.on = lunaroutpost.val;
						
				}
				
			});
			
			// auto observere, not that important and i like events
			sengine.addTimedEvent('autoobserve', 3000, function() {
				
				
				if (!sengine.kittenStorage.steamgui.autoobserve) {
					sengine.kittenStorage.steamgui.autoobserve = { 
						prices: [],
						flavor: 'We are not scientists',
						handler: function() {
							sengine.kittenStorage.steamgui.autoobserve.enabled = !sengine.kittenStorage.steamgui.autoobserve.enabled;
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: true,
						description: 'Request scientists observe the stars.',
						name: 'Auto Star Gazing'
					}
				}
				
				if (!sengine.kittenStorage.steamgui.autoobserve.enabled)
					return;
				
			   if (game.calendar.observeBtn == null) return;
			   
				game.calendar.observeHandler();
				activity('Steambot asked Kitten Scientists to observe a star', 'stars');
				sengine.activity.storeForSummary('stars', 1); 
				
			});
			
					// Auto hunt 
			sengine.addTimedEvent('SpaceKittens', 10000, function() {
				
				if (!sengine.kittenStorage.steamgui.autospacebuilds) {
					sengine.kittenStorage.steamgui.autospacebuilds = {
						prices: [],
						flavor: 'kittens in space',
						handler: function() {
							sengine.kittenStorage.steamgui.autospacebuilds.enabled = !sengine.kittenStorage.steamgui.autospacebuilds.enabled;		
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: true,
						description: 'send the kitten guards to kill the filthy mice.',
						name: 'Auto hunting'
					}
				}
				// global toggle
				if (!sengine.kittenStorage.steamgui.autospacebuilds.enabled)
					return;
				if (gamePage.spaceTab.GCPanel == null)
					return;
				if (gamePage.spaceTab.GCPanel.children == null)
					return;
				
				for (var i = 0; i < gamePage.spaceTab.GCPanel.children.length; ++i) {
					var gcitem = gamePage.spaceTab.GCPanel.children[i];
					if (!gcitem.enabled)
						continue;
					
				}
				
			});
			
			// faith
			sengine.addTimedEvent('kittenfaith', 500, function() {
				
				if (!sengine.kittenStorage.steamgui.autopray) {
					sengine.kittenStorage.steamgui.autopray = { 
						prices: [],
						flavor: 'Oh holy cat we have sinned',
						handler: function() {
							sengine.kittenStorage.steamgui.autopray.enabled = !sengine.kittenStorage.steamgui.autopray.enabled;
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: true,
						description: 'Kittens on their knees? It looks so awkward',
						name: 'Auto Pray'
					}
				}
				if (!sengine.kittenStorage.tuning.autoprayamount) {
					
					sengine.kittenStorage.tuning.autoprayamount = {
						percent: 0.02
					}
				}
				
				// global toggle
				if (!sengine.kittenStorage.steamgui.autopray.enabled)
					return;
				var faith = sengine.getRes('faith');
				sengine.kittenStorage.tuning.autoprayamount.value = (sengine.kittenStorage.tuning.autoprayamount.percent * faith.maxValue);
				var v = sengine.kittenStorage.tuning.autoprayamount.value;
				/* Do we care how much hunters gathered? it would be easy
				var current = {};
				for (var item in ['furs','spice','ivory','unicorns'])
					current[item] = engine.getRes('furs').value;*/
				
				if (!faith || faith.value < (faith.maxValue - v))
					return;
				
				var saveamount = faith.value - v;
				
				if (faith.value < faith.maxValue * .90)
					return;
				
				// 
				//faith.value -= saveamount;
				v = faith.value
				gamePage.religion.praise();	
				//faith.value += saveamount;
				

				activity(v.toFixed(2) + ' souls prayed for kitten kind<br>', 'faith');
				
				sengine.activity.storeForSummary('faith', v);
				
			});
			
			

			// buildbuildings check
			sengine.addTimedEvent('buildings', 5000, function() {
			
				if (!sengine.kittenStorage.steamgui.autobuilding) {
					/* global toggle for crafting */
					sengine.kittenStorage.steamgui.autobuilding = {
						prices: [],
						flavor: 'all the things',
						handler: function() {
							sengine.kittenStorage.steamgui.autobuilding.enabled = !sengine.kittenStorage.steamgui.autobuilding.enabled;
							sengine.saveToKittenStorage();
						},
						togglable: true,
						enabled: true,
						description: 'all the buildings get made.',
						name: 'Steam Auto Building'
					}
				}
				
				// global toggle
				if (!sengine.kittenStorage.steamgui.autobuilding.enabled)
					return;
			
				if (!sengine.kittenStorage.buildingtoggles)
					sengine.kittenStorage.buildingtoggles = {};
			
				for (var key in gamePage.bld.metaCache) {
					var bld = gamePage.bld.metaCache[key];
					if (!bld.meta.unlocked) continue;
					
					if (!sengine.kittenStorage.buildingtoggles[key]) {
									
						var bldtoggle = {
							prices: [],
							flavor: ' the taste of a '+key+' build',
							handler: function() {
								this.enabled = !this.enabled;
							},
							cost: {},
							// record of amounts we previously had
							previous: false,
							togglable: true,
							enabled: false,
							description: 'Auto make ' + key,
							name: key + ' Auto'
						};
						
						sengine.kittenStorage.buildingtoggles[key] = bldtoggle;
						
					}
					
					if (!sengine.kittenStorage.buildingtoggles[key].enabled)
						continue;
					
					var prices = gamePage.bld.getPrices(key),
						canbuild = true;
					for (var pdex in prices) {
						var price = prices[pdex];
						var resprice = sengine.getRes(price.name);
						if (resprice.value < price.val) {
							canbuild = false;
							break;
						}
							
					}
					
					if (!canbuild)
						continue;
						
					var makemebtn = com.nuclearunicorn.game.ui.BuildingBtn({building: key}, gamePage);
					
					//console.log(key + ' can be built');
					makemebtn.onClick({});
					
					activity('Kittens have built a new ' + sengine.getBuildingTitle(key));
					sengine.activity.storeForSummary(key, 1, 'build'); 
				}
				
			});
			
			
			// power consumption
			/*
			this.addTimedEvent('autotuner', 5000, function() {
				// try to togglet things that take power off, if max caps are met
				// global toggle
				//if (!sengine.kittenStorage.steamgui.autocrafting)
					return;
				
				var oil = getRes('oil');
				if (oil && oil.ResHitMax && oil.) {
					
					
					
					
				}
				
				
			}); */
			
			this.activity.resetActivitySummary();
			
		}, // end init
		
		getBuildingTitle: function(buttonkey) {
			for (var i = 0; i < gamePage.tabs[0].buttons.length; ++i) {
				if (gamePage.tabs[0].buttons[i].buildingName == buttonkey)
					return gamePage.tabs[0].buttons[i].name;
			}
			
			return buttonkey;
		},
		
		removeTimedEvent: function(name) {
			
			/*
			var mx = ['one','two','three','four']
			mx.splice(1,2)
				returns ["two", "three"]
			mx = 
				["one", "four"]
			*/
			if (!game.timer.eventlookup[name])
				return;
			game.timer.handlers.splice(game.timer.eventlookup[name].locationindex, 1);
			delete game.timer.eventlookup[name];
			
		},
		
		addTimedEvent: function(name, frequency, handler) {
			/* take frequency as miliseconds and convert to cat ticks */
			// 5 = 1 second in cat tick land
			frequency /= 200;
			if (frequency < 5) {
				console.warn(' capping event ' + name + ' at 5 cat ticks, ' + frequency + ' is too fast');
				frequency = 5;
			}
			
			
			// there needs to be an easy way to check if existing events are there
			// so we can remove or update...
			if (!game.timer.eventlookup) {
				game.timer.eventlookup = {};
				for (var i =  0; i < game.timer.handlers.length; ++i) {
					var h = game.timer.handlers[i];
					h.locationindex = i;
					if (!h.name)
						h.name = 'default_handler_' + i
					game.timer.eventlookup[h.name] = h;
				}
			}
			
			var unique_lookup = (Math.random() * 10000).toFixed(0);
			
			this.removeTimedEvent(name);
			
			game.timer.addEvent(dojo.hitch(this, handler), unique_lookup);
			
			for (var i =  0; i < game.timer.handlers.length; ++i) {
				var h = game.timer.handlers[i];
				// update all the indexes in case something was moved.
				h.locationindex = i;
				if (h.name) continue;
				//console.log('checking for item ' + unique_lookup, h);
				if (h.frequency == unique_lookup)  {
					//console.log('found item');
					h.name = name;
					h.frequency = frequency;
					game.timer.eventlookup[name] = h;
					break;
				}
			}
		},
		
		
		// Saving / restoring details
		// ====================

		kittenStorage: {
			version: 0,
			
			
			
			tuning: {
			
				
			},
			buildingtoggles: {
				
				
			},
			craftingtoggles: {
				
				
			},
			/* options for how steambot works. */
			steamgui: {
				
				
				
			},
			items: {},
			resources: {}
		},
		
		saveToKittenStorage: function () {
			//this.kittenStorage.resources = options.auto.resources;
			localStorage[this.namespace] = JSON.stringify(this.kittenStorage);
		},
		loadFromKittenStorage: function () {
			var saved = JSON.parse(localStorage[sengine.namespace] || 'null');
			if (saved) { // && saved.version == sengine.kittenStorageVersion) {
				this.kittenStorage = saved;

			} else {
				this.saveToKittenStorage();
			}
		},

		
		// Summary / stats - code kidnapped from kitten scientists
		// ====================
		
		activity: {
			summary: {},
			resetActivitySummary: function () {
				this.summary = {
					lastyear: game.calendar.year,
					lastday:  game.calendar.day,
					craft:    {},
					trade:    {},
					build:    {},
					other:    {} 
				};
			},
			
			storeForSummary: function (name, amount, section) {
				//console.log(name, amount, section);
				if (amount === undefined) amount = 1;
				if (section === undefined) section = 'other';

				if (this.summary[section] === undefined)
					this.summary[section] = {};

				if (this.summary[section][name] === undefined ||
					isNaN(this.summary[section][name])) {
					this.summary[section][name] = parseInt(amount, 10);
				} else {
					this.summary[section][name] += parseInt(amount, 10);
				}
			},

			displayActivitySummary: function () {
				
				if (this.summary.research) {
					var keylist = Object.keys(this.summary.research);
					for (var ix = 0; ix < keylist.length; ++ix) {
						summary('Researched ' + keylist[ix] + ' ----');
					}
				}
				if (this.summary.workshop) {
					var keylist = Object.keys(this.summary.workshop);
					for (var ix = 0; ix < keylist.length; ++ix) {
						summary('Workshops ' + keylist[ix] + ' ----');
					}
				}
				
				// Festivals
				if (this.summary.other.festival) {
					summary('Held ' + game.getDisplayValueExt(this.summary.other.festival) + ' festivals');
				}

				// Observe stars
				if (this.summary.other.stars) {
					summary('Observed ' + game.getDisplayValueExt(this.summary.other.stars) + ' stars');
				}

				// Praise the Sun
				if (this.summary.other.faith) {
					summary('Accumulated ' + game.getDisplayValueExt(this.summary.other.faith) + ' by praising the sun');
				}

				// Hunters
				if (this.summary.other.hunt) {
					summary('Sent ' + game.getDisplayValueExt(this.summary.other.hunt) + ' adorable kitten squads');
				}

				// Buildings
				for (var name in this.summary.build) {
					summary('Build: +' + game.getDisplayValueExt(this.summary.build[name]) + ' ' + ucfirst(name) + ' ----');
				}

				// Crafts
				for (var name in this.summary.craft) {
					if (isNaN(this.summary.craft[name]) ||
						parseInt(this.summary.craft[name]) == 0)
						continue;
					summary('Craft: +' + game.getDisplayValueExt(this.summary.craft[name]) + ' ' + ucfirst(name) + ' ----');
				}

				// Trading
				for (var name in this.summary.trade) {
					summary('Trade: ' + game.getDisplayValueExt(this.summary.trade[name]) + 'x ' + ucfirst(name));
				}

				// Show time since last run. Assumes that the day and year are always higher.
				if (this.summary.lastyear && this.summary.lastday) {
					var years = game.calendar.year - this.summary.lastyear;
					var days = game.calendar.day - this.summary.lastday;

					if (days < 0) {
						years -= 1;
						days += 400;
					}

					var duration = '';
					if (years > 0) {
						duration += years + ' ';
						duration += (years == 1) ? 'year' : 'years';
					}

					if (days >= 0) {
						if (years > 0) duration += ' and ';
						duration += roundToTwo(days) + ' ';
						duration += (days == 1) ? 'day' : 'days';
					}

					summary('Summary of the last ' + duration);
				}

				// Clear out the old activity
				this.resetActivitySummary()
			},
		}
		
	}


	// GameLog Modification
	// ====================

	var gameLog = com.nuclearunicorn.game.log.Console().static;
	window.gameLog = gameLog;

	// Increase the game log's message capacity
	gameLog.msg = function (message, type, tag) {
		if (tag && this.filters[tag] && !this.filters[tag].enabled){
			return;
		}

		var gameLog = dojo.byId("gameLog");
		var span = dojo.create("span", { innerHTML: message, className: "msg" }, gameLog, "first");

		if (type){
			dojo.addClass(span, "type_"+type);
		}

		var spans = this.spans;
		spans.push(span);
		if (spans.length > options.logMessages){
			dojo.destroy(spans.shift()); //remove the first element from the array and destroy it
		}

		return span;
	};

	// Add message filters for hunts and trades
	gameLog.filters.hunt = {
		title: "Hunts",
		enabled: true,
		unlocked: true
	};
	gameLog.filters.trade = {
		title: "Trades",
		enabled: true,
		unlocked: true
	};
	//gameLog.rederFilters();

	var printoutput = function (args) {
		var color = args.pop();
		args[1] = args[1] || 'ks-default';

		// update the color of the message immediately after adding
		gameLog.msg.apply(gameLog, args);
		$('.type_' + args[1]).css('color', color);

		if (options.debug && console) console.log(args);
	};

	// Used for option change messages and other special notifications
	var message = function () {
		var args = Array.prototype.slice.call(arguments);
		args.push('ks-default');
		args.push(options.msgcolor);
		printoutput(args);
	};

	var activity = function () {
		if (options.showactivity) {
			var args = Array.prototype.slice.call(arguments);
			args.push('ks-activity');
			args.push(options.activitycolor);
			printoutput(args);
		}
	};

	var summary = function () {
		var args = Array.prototype.slice.call(arguments);
		args.push('ks-summary');
		args.push(options.summarycolor);
		printoutput(args);
	};
	
	var toggleoff = function() {
		var args = Array.prototype.slice.call(arguments);
		args.push('ks-toggleoff');
		args.push(options.disabledcolor);
		printoutput(args);
	};
	var toggleon = function() {
		var args = Array.prototype.slice.call(arguments);
		args.push('ks-toggleon');
		args.push(options.enabledcolor);
		printoutput(args);
	};

	var warning = function () {
		var args = Array.prototype.slice.call(arguments);
		args.unshift('Warning!');

		if (console) console.log(args);
	};

	var ucfirst = function (text) {
		return text.charAt(0).toUpperCase() + text.substr(1);
	};
	var roundToTwo = function (n) {
		return +(Math.round(n + "e+2") + "e-2")
	};

	
	window.sengine = new SteamEngine();

	window.sengine.init();
	sengine = window.sengine;
		
//}, false);

