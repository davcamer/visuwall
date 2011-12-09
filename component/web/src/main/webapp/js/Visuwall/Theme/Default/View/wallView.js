define(['jquery', //
        'log', //
        'jqueryui' //
        ], function($, log) {
	"use strict";
	
	
	var buildVisualDuration = function(duration) {
		var inst = {
			options : {
				compact : true,
				format : 'dhms'
			},
			_periods : [ 0, 0, 0, 0, 0, 0, 0 ],
			_show : [ '!', '!', '!', '!', '!', '!', '!' ]
		};

		inst._now = new Date();
		inst._until = new Date(inst._now.getTime() + duration);
		inst._show = jQuery.countdown._determineShow(inst);
		var res = jQuery.countdown
				._calculatePeriods(inst, inst._show, 0, inst._now);
		var html = jQuery.countdown._generateHTML(inst);
		var good = strip(html);
		if (inst._periods[0] == 0 && inst._periods[1] == 0 && inst._periods[2] == 0
				&& inst._periods[3] == 0 && inst._periods[4] == 0
				&& inst._periods[5] == 0) {
			good += 's';
		}
		return good;
	};

	
	var wallView = new function() {
			var $this = this;
			this.table;

			this.statusClasses = [ 'failure-state', 'success-state', 'unstable-state',
					'aborted-state', 'new-state', 'notbuilt-state', 'unknown-state' ];

			$(function() {
				$this.table = $('ul#projectsTable').sortable().disableSelection();
			});

			this.setLastUpdate = function(projectId, date) {
				var lastUpdate = $this._getElement(projectId, 'SPAN.lastUpdate');
				lastUpdate.html(date);
			};

			this.getLastUpdate = function(projectId, callback) {
				var lastUpdate = $this._getElement(projectId, 'SPAN.lastUpdate');
				callback(lastUpdate.html());
			};

			this.isProject = function(projectId, callback) {
				var isproject = $this._getElement(projectId, '').length > 0;
				callback(isproject);
			};

			this.getProjectIds = function(callback) {
				var res = [];
				var projects = $('LI.project', $this.table);
				for ( var i = 0; i < projects.length; i++) {
					res[i] = projects[i].id;
				}
				callback(res);
			};

			this.addProject = function(projectId, name) {
				log.info('add project to display : ' + projectId);

				var newCss = $this._runResize($('LI.project', $this.table).length + 1);

				var projectLI = $this._buildProjectTD(projectId, name);
				projectLI.css(newCss);
				$this.table.append(projectLI);
				projectLI.fadeIn("slow");
			};

			/**
			 * return newCss to apply to a new Project
			 */
			this._runResize = function(NumberOfProjects) {
				var currentProjects = $('LI.project', $this.table);

				var projectsByRow = Math.ceil(Math.sqrt(NumberOfProjects));
				var rows = Math.ceil((NumberOfProjects) / projectsByRow);

				var newCss = {
					width : (99 / projectsByRow) + '%',
					height : 97 / rows + '%',
					margin : (1 / (rows * 2)) + '% ' + (1 / (projectsByRow * 2)) + '%'
				};
				currentProjects.stop(true, false);
				currentProjects.css({
					opacity : '1',
					display : 'inline-block'
				});

				currentProjects.animate(newCss, 1500, function() {
//					$('.projectName', currentProjects).textfill();
				});
				
//				currentProjects.animate(newCss, {
//					step : function(now, fx) {
//						$('.projectName', fx.elem).textfill();
////						var data = fx.elem.id + ' ' + fx.prop + ': ' + now;
////						$('body').append('<div>' + data + '</div>');
//					}
//				});

				// .textfill({ maxFontPixels: 70 })

				return newCss;
			};

			this.removeProject = function(projectId) {
				$this._runResize($('LI.project', $this.table).length - 1);
				$this._getElement(projectId).fadeOut("slow").remove();
			};
			
			this.removeAllProjects = function() {
				$('LI.project', $this.table).remove();
			};

			this.setCountdown = function(projectId, finishDate) {
				$this._hideQuality(projectId);
				$this._hideCommiters(projectId);
				var countdownElement = $this._getElement(projectId, 'p.timeleft');
				countdownElement.countdown({
					until : finishDate,
					compact : true,
					format : 'dHMS',
					onExpiry : function() {
						countdownElement.html('N/A');
					}
				});
				$this._showCountdown(projectId);
			};

			this.updateBuildTime = function(projectId, duration) {
				var good = buildVisualDuration(duration);
				$this._getElement(projectId, 'span.duration').html(' ~ ' + good);
			};

			this.updateQuality = function(projectId, quality) {
				if (Object.size(quality) == 0) {
					$this._hideQuality(projectId);
					return;
				}
				var qualityLi = '';
				for ( var i = 0; i < quality.length; i++) {
					var name = quality[i].value.name;
					var value = quality[i].value.formattedValue;
					qualityLi += '<li>' + name + ': ' + value + '</li>';
				}
				$this._getElement(projectId, 'UL.quality').append($(qualityLi))
						.marquee({
							yScroll : 'bottom'
						});
				$this._showQuality(projectId);
			};

			this.showBuilding = function(projectId) {
				$this._getElement(projectId).blink({
					fadeDownSpeed : 2000,
					fadeUpSpeed : 2000,
					blinkCount : -1,
					fadeToOpacity : 0.5
				});
			};
			this.stopBuilding = function(projectId) {
				$this._getElement(projectId).stopBlink();
				$this._hideCountDown(projectId);
			};

			this.updateCommiters = function(projectId, commiters) {
				var nameDiv = $this._getElement(projectId, '.projectName');
				var statusNeedCommiters = false;
				if (nameDiv.hasClass('failure-state')
						|| nameDiv.hasClass('unstable-state')) {
					statusNeedCommiters = true;
				}
				if (commiters.length == 0 || !statusNeedCommiters) {
					$this._hideCommiters(projectId);
					return;
				}
				var commiterString = '';
				for ( var i = 0; i < commiters.length; i++) {
					var commiter = commiters[i];
					commiterString += '<li><img src="'
							+ get_gravatar(commiter.email == null ? "" : commiter.email, 250)
							+ '" style="height:100%" /></li>';
				}
				$this._getElement(projectId, 'ul.commiters').html($(commiterString))
						.marquee({
							yScroll : 'bottom'
						});
				$this._showCommiters(projectId);
			};

			this.displaySuccess = function(projectId) {
				$this._hideCommiters(projectId);
				$this._getElement(projectId, '.projectName').switchClasses(
						$this.statusClasses, 'success-state', 3000);
			};

			this.displayFailure = function(projectId) {
				$this._getElement(projectId, '.projectName').switchClasses(
						$this.statusClasses, 'failure-state', 3000);
				$this._getElement(projectId).prependTo($this.table);
				$this._hideQuality(projectId);
			};
			this.displayUnstable = function(projectId) {
				$this._getElement(projectId, '.projectName').switchClasses(
						$this.statusClasses, 'unstable-state', 3000);
				$this._getElement(projectId).prependTo($this.table);
			};

			this.displayNew = function(projectId) {
				$this._getElement(projectId, '.projectName').switchClasses(
						$this.statusClasses, 'new-state', 3000);
			};

			this.displayAborted = function(projectId) {
				$this._getElement(projectId, '.projectName').switchClasses(
						$this.statusClasses, 'aborted-state', 3000);
				$this._getElement(projectId).prependTo($this.table);
			};

			this.displayNotbuilt = function(projectId) {
				$this._getElement(projectId, '.projectName').switchClasses(
						$this.statusClasses, 'notbuilt-state', 3000);
				$this._getElement(projectId).prependTo($this.table);
			};

			this.displayUnknown = function(projectId) {
				$this._getElement(projectId, '.projectName').switchClasses(
						$this.statusClasses, 'unknown-state', 3000);
				$this._getElement(projectId).prependTo($this.table);
			};

			this.updateUT = function(projectId, fail, success, skip) {
				$this._updateTest(projectId, fail, success, skip, 'u');
			};

			this.updateIT = function(projectId, fail, success, skip) {
				$this._updateTest(projectId, fail, success, skip, 'i');
			};

			this.updateUTCoverage = function(projectId, coverage) {
				if (coverage == 0) {
					coverage = 100;
				}
				$this._updateCoverage(projectId, coverage, 'u');
			};

			this.updateITCoverage = function(projectId, coverage) {
				if (coverage == 0) {
					coverage = 100;
				}
				$this._updateCoverage(projectId, coverage, 'i');
			};

			this.updateUTDiff = function(projectId, failDiff, successDiff, skipDiff) {
				$this._updateTestDiff(projectId, failDiff, successDiff, skipDiff, 'u');
			};

			this.updateAgo = function(projectId, finishBuild) {
				var abbr = $this._getElement(projectId, 'abbr.timeago');
				if (finishBuild == 0) {
					abbr.html('never');
					return;
				}
				abbr.attr("title", ISODateString(new Date(finishBuild)));
				abbr.data("timeago", null).timeago();
			};

			// ///////////////////////////////////////////////

			this._updateTestDiff = function(projectId, failDiff, successDiff, skipDiff,
					type) {
				if (successDiff) {
					$this._getElement(projectId,
							'TABLE.' + type + 'Test TD.success SPAN.diff').html(
							this._getBracketed(this._getSignedInt(successDiff)))
							.fadeIn("slow");
				} else {
					$this._getElement(projectId,
							'TABLE.' + type + 'Test TD.success SPAN.diff').hide();
				}

				if (failDiff) {
					$this._getElement(projectId,
							'TABLE.' + type + 'Test TD.failure SPAN.diff').html(
							this._getBracketed(this._getSignedInt(failDiff))).fadeIn(
							"slow");
				} else {
					$this._getElement(projectId,
							'TABLE.' + type + 'Test TD.failure SPAN.diff').hide();
				}

				if (skipDiff) {
					$this._getElement(projectId,
							'TABLE.' + type + 'Test TD.ignore SPAN.diff').html(
							this._getBracketed(this._getSignedInt(skipDiff))).fadeIn(
							"slow");
				} else {
					$this._getElement(projectId,
							'TABLE.' + type + 'Test TD.ignore SPAN.diff').hide();
				}
			};

			this._getBracketed = function(value) {
				if (value == null) {
					return;
				}
				return '(' + value + ')';
			};

			this._getSignedInt = function(value) {
				if (value > 0) {
					return '+' + value;
				} else if (value < 0) {
					return '' + value;
				} else {
					return null;
					// return '±0';
				}
			};

			this._updateCoverage = function(projectId, coverage, type) {
				var displayCoverage = coverage;
				if (coverage == undefined || coverage == 0) {
					displayCoverage = 100;
				}
				$this._getElement(projectId, 'TABLE.' + type + 'Test').animate({
					width : displayCoverage + "%"
				}, 3000);
			};

			this._updateTest = function(projectId, fail, success, skip, type) {
				if (fail == 0 && success == 0 && skip == 0) {
					$this['_hide' + type + 'T'](projectId);
					return;
				}
				var allTest = fail + success + skip;
				var failBar = (fail * 100) / allTest;
				var successBar = (success * 100) / allTest;
				var skipBar = (skip * 100) / allTest;
				if (success != 0) {
					$this._getElement(projectId,
							'TABLE.' + type + 'Test TD.success SPAN.num').html(success);
					$this._getElement(projectId, 'TABLE.' + type + 'Test TD.success')
							.animate({
								width : successBar + "%"
							}, 2000).fadeIn("slow");
				} else {
					$this._getElement(projectId, 'TABLE.' + type + 'Test TD.success')
							.hide();
				}
				if (fail != 0) {
					$this._getElement(projectId,
							'TABLE.' + type + 'Test TD.failure SPAN.num').html(fail);
					$this._getElement(projectId, 'TABLE.' + type + 'Test TD.failure')
							.animate({
								width : failBar + "%"
							}, 2000).fadeIn("slow");
				} else {
					$this._getElement(projectId, 'TABLE.' + type + 'Test TD.failure')
							.hide();
				}
				if (skip != 0) {
					$this._getElement(projectId,
							'TABLE.' + type + 'Test TD.ignore SPAN.num').html(skip);
					$this._getElement(projectId, 'TABLE.' + type + 'Test TD.ignore')
							.animate({
								width : skipBar + "%"
							}, 2000).fadeIn("slow");
				} else {
					$this._getElement(projectId, 'TABLE.' + type + 'Test TD.ignore')
							.hide();
				}
				$this['_show' + type + 'T'](projectId);
			};

			this._getElement = function(projectId, suffix) {
				var request = 'LI[id="' + projectId + '"]';
				if (suffix != undefined) {
					request += ' ' + suffix;
				}
				return $(request, $this.table);
			};

			this._buildProjectTD = function(projectId, projectName) {
				var projectTD = $('<li style="display:none" id="' + projectId
						+ '" class="project"></li>');
				var projectInnerTable = $('<table class="innerTable"><tbody></tbody></table>');
				projectTD.append(projectInnerTable);

				projectInnerTable
						.append($('<tr><td class="projectName"><span>' + projectName + '</span>'
								+ ' <div class="inlineInfo"><abbr class="timeago" title=""></abbr> <span class="duration"></span><div><span class="lastUpdate"></span></td></tr>'));
				projectInnerTable
						.append($('<tr style="display:none; height: 80%" class="commitersTR"><td><ul class="commiters marquee" style="height: 100%"></ul></tr></td>'));
				projectInnerTable
						.append($('<tr style="display:none" class="qualityTR"><td><ul class="quality marquee"></ul></tr></td>'));
				projectInnerTable
						.append($('<tr style="display:none" class= "timeleftTR"><td><p class="timeleft"></p></tr></td>'));
				projectInnerTable
						.append($('<tr style="display:none" class="iTestTR"><td class="iTestTD"><table class="iTest"><tr><td class="failure"><span class="num"></span><span class="diff"></span></td><td class="ignore"><span class="num"></span><span class="diff"></span></td><td class="success"><span class="num"></span><span class="diff"></span></td></tr></table></tr></td>'));
				projectInnerTable
						.append($('<tr style="display:none" class="uTestTR"><td class="uTestTD"><table class="uTest"><tr><td class="failure"><span class="num"></span><span class="diff"></span></td><td class="ignore"><span class="num"></span><span class="diff"></span></td><td class="success"><span class="num"></span><span class="diff"></span></td></tr></table></tr></td>'));
				return projectTD;
			};

			this._hideCountDown = function(projectId) {
				$this._getElement(projectId, 'TR.timeleftTR').hide();
			};
			this._hideQuality = function(projectId) {
				$this._getElement(projectId, 'TR.qualityTR').hide();
			};
			this._showQuality = function(projectId) {
				$this._getElement(projectId, 'TR.qualityTR').show();
			};
			this._hideCommiters = function(projectId) {
				$this._getElement(projectId, "TR.commitersTR").hide();
			};
			this._showCommiters = function(projectId) {
				$this._getElement(projectId, "TR.commitersTR").show();
			};
			this._hideiT = function(projectId) {
				$this._getElement(projectId, "TR.iTestTR").hide();
			};
			this._hideuT = function(projectId) {
				$this._getElement(projectId, "TR.uTestTR").hide();
			};
			this._showiT = function(projectId) {
				$this._getElement(projectId, "TR.iTestTR").show();
			};
			this._showuT = function(projectId) {
				$this._getElement(projectId, "TR.uTestTR").show();
			};
			this._showCountdown = function(projectId) {
				$this._getElement(projectId, "TR.timeleftTR").show();
			};
			this._hideCountdown = function(projectId) {
				$this._getElement(projectId, "TR.timeleftTR").hide();
			};
		};
		
	return wallView;
});