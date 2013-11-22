//binds the remove swot entry event
function bindRemoveSwot() {

    $(".remove-swot").off("click");
    $(".remove-swot").click(function () {

        var container = $(this).closest(".swot-container");
        $(this).closest(".swot-entry").fadeOut(function () {
            $(this).remove();
            var swots = GetSwotData($(container));
            if (swots.length == 0) {
                DisablePostCreation('Please fill at least one swot entry');
            }
            else {
                EnablePostCreation();
                debugger;
                $(container).find(".save-swot").fadeIn();
            }
            if ($(this).closest(".swot-container").find(".save-swot").length > 0) {
                //edit mode
            }
            else {
                //creation mode			
                AttachedContent = swots;
                AttachedContentType = 'Swot';
                AttachedPostType = PluginDictionary['Swot'];
            }
            // }


        });
    });
}



//binds all the methods: create, remove, save
function bindMethods() {

    bindRemoveSwot();
    $(".add-swot").off("click");
    $(".add-swot").click(function () {

        var textField = $(this).parent().find(".swot-text");
        var text = $(textField).val();
        $(textField).val('');
        var type = $(this).attr("swot-type");
        var html = '<div class="swot-entry" swot-text="' + escape(text) + '" type="' + type + '" created-by="' + GetCurrentUserName() + '"><b>' + GetCurrentUserName() + '</b><br/> ' + text + '<div class="remove-swot"></div></div>';
        debugger;

        $(this).parent().parent().find(".swot-list").prepend(html);
        bindRemoveSwot();
        $(this).closest(".swot-container").find(".save-swot").fadeIn();

        //check if swot has some content
        var swots = GetSwotData($(this).closest(".swot-container"));

        if (swots.length == 0) {
            DisablePostCreation('Please fill at least one swot entry');
        }
        else {
            EnablePostCreation();
            if ($(this).closest(".swot-container").find(".save-swot").length > 0) {
                //edit mode
            }
            else {
                //creation mode			
                AttachedContent = swots;
                AttachedContentType = 'Swot';
                AttachedPostType = PluginDictionary['Swot'];
            }

        }


    });

    $(".save-swot").off("click");
    $(".save-swot").click(function () {
        //gather all swot entries
        var container = $(this).closest(".swot-container")
        var swots = GetSwotData(container);
        UpdatePostContent($(this).attr("postId"), swots, function () {
            $(container).find(".save-swot").fadeOut();
            apprise("Swot Saved!");
        },
		function () {
		    apprise("Could not save Swot! Please refresh the page and try again...!");
		}
		);
    }
);


}


//Gets the swot entries for a specific container. Can be used when creating a post or when updating a swot analysis
function GetSwotData(container) {

    var swotList = [];

    $(container).find(".swot-entry").each(function (index, element) {
        var swot =
        {
            creatorName: $(element).attr("created-by"),
            text: $(element).attr("swot-text"),
            createdOn: new Date().getDate(),
            type: $(element).attr("type")
        };
        swotList[swotList.length] = swot;
    });

    var d = new Date();
    var milliseconds = d.getTime();

    var result = {
        swots: swotList,
        lastUser: GetCurrentUserName(),
        lastUpdate: milliseconds
    }



    return result;
}



//gets the HTML that generates the swot placeholder
//for first time executions (post creation) there is not the save button nor the last update
function GetContainerHtml(firstTime, postId) {

    var strVar = "";
    strVar += " <div class=\"swot-container\">";
    if (!firstTime) {
        strVar += "      <div class=\"save-swot\" postId=\"" + postId + "\">SAVE CHANGES<\/div>";
    }
    strVar += "      <div class=\"line\">";
    strVar += "          <div class=\"strengths\">";
    strVar += "              <h1>Strengths<\/h1>";
    strVar += "              <div class=\"enter-swot\">";
    strVar += "        <input class=\"swot-text\" type=\"text\" \/>";
    strVar += "        <input type=\"button\" value=\"Add\" class=\"add-swot\" swot-type=\"strength\"\/>";
    strVar += "    <\/div>";
    strVar += "    <div class=\"strength-container swot-list\"><\/div>";
    strVar += "<\/div>";
    strVar += "<div class=\"weaknesses\">";
    strVar += "    <h1>Weaknesses<\/h1>";
    strVar += "    <div class=\"enter-swot\">";
    strVar += "        <input class=\"swot-text\" type=\"text\" \/>";
    strVar += "        <input type=\"button\" value=\"Add\" class=\"add-swot\" swot-type=\"weakness\" \/>";
    strVar += "    <\/div>";
    strVar += "    <div class=\"weakness-container swot-list\"><\/div>";
    strVar += "<\/div>";
    strVar += "<\/div>";
    strVar += "<div class=\"line\">";
    strVar += "    <div class=\"opportunities\">";
    strVar += "        <h1>Opportunities<\/h1>";
    strVar += "        <div class=\"enter-swot\">";
    strVar += "        <input class=\"swot-text\" type=\"text\" \/>";
    strVar += "        <input type=\"button\" value=\"Add\" class=\"add-swot\" swot-type=\"opportunity\"\/>";
    strVar += "    <\/div>";
    strVar += "    <div class=\"opportunity-container swot-list\"><\/div>";
    strVar += "<\/div>";
    strVar += "<div class=\"threats\">";
    strVar += "    <h1>Threats<\/h1>";
    strVar += "    <div class=\"enter-swot\">";
    strVar += "        <input class=\"swot-text\" type=\"text\" \/>";
    strVar += "        <input type=\"button\" value=\"Add\" class=\"add-swot\" swot-type=\"threat\"\/>";
    strVar += "    <\/div>";
    strVar += "    <div class=\"threat-container swot-list\"><\/div>";
    strVar += "<\/div>";
    strVar += "<\/div>";
    if (!firstTime) {
        strVar += "<div class=\"swot-info\">";
        strVar += "    Last update by John Red 2 days ago";
        strVar += "<\/div>";
    }

    strVar += "<\/div>";

    return strVar;

}

//injects a swot entry into a specific container
function InjectSwot(outContainer, swot) {
    var container = "." + swot.type + "-container";
    swot.text = unescape(swot.text);
    var html = '<div class="swot-entry" swot-text="' + escape(swot.text) + '" type="' + swot.type + '" created-by="' + swot.creatorName + '"><div class="remove-swot"></div><b>' + swot.creatorName + '</b><br/> ' + swot.text + '</div>';
    $(outContainer).find(container).append(html);
}


//Entry Point - Creates the swot container, re-binds the methods and deactivates post creation until a swot entry is filled
function CreateSwot() {
    var container = getPostDataContainer();
    $(container).html(GetContainerHtml(true));
    $(container).fadeIn();
    bindMethods();
    
    //disables the post creation until a swot entry is filled
    DisablePostCreation('Please fill at least one swot entry');
}



//displays the swot entries for the posts of this type
function DisplaySwotsForPosts(additionalContent) {
    var postType = PluginDictionary['Swot'];
    $.each(additionalContent, function (index, content) {
        if (content.PostType == postType) {
            debugger;
            var container = $("#" + content.PostId);
            $(container).find(".post-text").after(GetContainerHtml(false, content.PostId));
            var content = JSON.parse(content.Content);
            var swots = content.swots;
            $.each(swots, function (index, swot) {
                InjectSwot(container, swot);
            });
            $(container).find(".swot-info").html("last update by " + content.lastUser + " - " + $.easydate.format_date(new Date(content.lastUpdate)));
        }
    });
    bindMethods();
}

//adds the swot processing method to the collection of aditional content processing methods
AddAdditionalContentWallCallback(DisplaySwotsForPosts);




