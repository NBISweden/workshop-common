function renderEvents(myWidget, calendarId, key, past, hashTags, topNEvents, calendarIcon) {
    var googleCalUrl = "https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events?key=" + key + "&orderBy=startTime&singleEvents=true";
    if (past) {
        googleCalUrl = googleCalUrl + "&timeMax=" + new Date().toISOString();
    } else {
        googleCalUrl = googleCalUrl + "&timeMin=" + new Date().toISOString();
    }

    var getTags = function (description) {
        var tags = [];
        var match;
        var regex = /(^|\s)#(\w[\w-]*)(?=\s|$)/g;
        while (match = regex.exec(description)) {
            tags.push(match[2].toLowerCase());
        }
        return tags;
    }

    var formatEvent = function (event) {
        var tags = hashTags.replace(/\s/g, '').toLowerCase().split(",");
        if (tags.length == 1 && tags[0] == '') {
            tags = [];
        }
        var urlregex = /(https?:\/\/\S+?)(\.?([\s\n]|$))/gi;
        var repl = '<span class="plainlinks"><a class="external text" rel="nofollow" href="$1">$1</a></span>$2';
        var summary = event.summary;
        var url = "";
        var calendarurl = event.htmlLink;
        var description = event.description || "";
        var date = (event.start.date || event.start.dateTime).split('T')[0];
        var enddate = (event.end.date || event.end.dateTime).split('T')[0];
        var location = event.location;
        var d = new Date(enddate);
        d.setDate(d.getDate() - 1);
        if (d <= new Date(date)) {
            enddate = date;
        } else {
            enddate = d.toISOString().split('T')[0];
        }

        var websiteRegEx = new RegExp('^#url:.*$',"m");
        var hashtagRegEx = new RegExp('^#.*$',"mg");
        var websiteReg = description.match(websiteRegEx);
        var cleanDescription = description.replace(websiteReg, '');

        var blurb = description.split('\n')[0].replace(urlregex, repl);

        // url
        if (websiteReg)
            url = websiteReg[0].replace(/#url:\s*/,"");
        else
            url = calendarurl;

        // details
        var details = "";
        if (cleanDescription)
            details = cleanDescription.replace(urlregex, repl).replace(/\n/g, '<br/>\n');;
        
        // return empty string if required tags not present, uses descriptionmatch from above
        if (tags.length > 0) {
            if (!details) {
                return '';
            }
            var eventtags = getTags(cleanDescription);
            for (var i in tags) {
                if (eventtags.indexOf(tags[i]) == -1) {
                    return '';
                }
            }
        }
        details = details.replace(hashtagRegEx, '');
        summary = summary.replace(hashtagRegEx, '');
        //blurb = blurb.replace(hashtagRegEx, '');
        blurb = null;
        // url (uses descriptionmatch from above)
        
        var ret = '<dt>';
        var loc = '';
        if (url) {
            ret = ret + '<a href="' + url + '">' + date + " " + summary + '</a> <a href="' + calendarurl + '">' + calendarIcon + '</a>';
        } else {
            ret = ret + summary;
        }
        ret = ret + '</dt><dd>';
        //if (enddate == date) {
        //    ret = ret + '</b></dt><dd>' + date + '<br/>';
        //} else {
        //    ret = ret + '</b></dt><dd>' + date + ' &ndash; ' + enddate + '<br/>';
        //}
        if (location) {
            loc = 'Location: ' + location + '<br/>';
        }
        if (blurb) {
            ret = ret + blurb + '<br/>';
        }
        if (details) {
            ret = ret + '<span class="detail">' +
               '<span class="hideable" style="display:none;">' + loc + details + '</span>' +
               '<div class="toggle" style="cursor:help"><a><small>Click to show/hide details</small></a></div>';
        }
        ret = ret + '</dd>';
        return ret;
    }

    $.getJSON(googleCalUrl, function (data) {
        
        var events = [];
        if (topNEvents === "") {
            $.each(data.items, function (i, event) {
                events.push(formatEvent(event));
            });
            if (past) {
                events.reverse();
            }
        } else {
            if (!past) {
                $.each(data.items, function (i, event) {
                    if (i < topNEvents)
                        events.push(formatEvent(event));
                });
            } else {
                $.each(data.items, function (i, event) {
                   events.push(formatEvent(event));
                });
                events.reverse();
                events =  events.splice(0, topNEvents);
            }
        }

        
        $("<dl/>", { html: events.join("") }).appendTo(myWidget);
    });

    $(document).ready(function () {
        $(myWidget).on("click", ".toggle", function () {
            $(this).closest(".detail").find(".hideable").toggle("fast");
        });
    });
};
