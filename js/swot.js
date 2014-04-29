function bindRemoveSwot()
{
	$(".remove-swot").off("click");
	$(".remove-swot").click(function () {
	
			var container = $(this).closest(".swot-container");
			$(this).closest(".swot-entry").fadeOut(function () {
				$(this).remove();
				var swots =GetSwotData($(container));
				if(swots.length==0)
				{
					DisablePostCreation('Please fill at least one swot entry');
				}
				else
				{
					EnablePostCreation();
					debugger;
					$(container).find(".save-swot").fadeIn();
				}
				if($(this).closest(".swot-container").find(".save-swot").length>0)
				{
					//edit mode
				}
				else
				{
					//creation mode			
					AttachedContent = swots;
					AttachedContentType='Swot';
					AttachedPostType = PluginDictionary['Swot'];
				 }
			// }
				
				
			});
		});
}

function blink(obj){ 
	obj.delay(200).fadeTo(200,0.5).delay(200).fadeTo(200,1).delay(200).fadeTo(200,0.5).delay(200).fadeTo(200,1).delay(200).fadeTo(200,0.5).delay(200).fadeTo(200,1);
}

function bindMethods() {
    
	bindRemoveSwot();
	$(".add-swot").off("click");
    $(".add-swot").click(function () {
	
        var textField = $(this).parent().find(".swot-text");
        var text = $(textField).val();
		
		if(text == '' || text == textField.attr('watermark')) {
			return;
		}
		
        $(textField).val('');
        var type = $(this).attr("swot-type");
        var html = '<div class="swot-entry" swot-text="' + escape(text) + '" type="' + type + '" created-by="' + GetCurrentUserName() + '" createdById="' + MyEWCurrentUserId + '"><div class="remove-swot"></div><div class="swot-entry-text">' + text + '</div><div class="swot-entry-creator">' + GetCurrentUserName() +'</div></div>';

        $(this).parent().parent().find(".swot-list").prepend(html);
        bindRemoveSwot();
		
		var saveSwotBtn = $(this).closest(".swot-container").find(".save-swot");
        saveSwotBtn.fadeIn(function() {
			blink(saveSwotBtn);
		});
		
		
		//check if swot has some content
		var swots = GetSwotData($(this).closest(".swot-container"));
		
		if(swots.length==0)
		{
			DisablePostCreation('Please fill at least one swot entry');
		}
		else
		{
			EnablePostCreation();
			if($(this).closest(".swot-container").find(".save-swot").length>0)
			{
				//edit mode
			}
			else
			{
				//creation mode			
				AttachedContent = swots;
				AttachedContentType='Swot';
				AttachedPostType = PluginDictionary['Swot'];
			}
		}
    });

    $(".save-swot").off("click");
    $(".save-swot").click(function () {
        //gather all swot entries
		var container = $(this).closest(".swot-container")
        var swots =GetSwotData(container);
        UpdatePostContent($(this).attr("postId"), swots, function()
		{
			$(container).find(".save-swot").fadeOut();
			apprise("SWOT saved successfully.", null, null, container);
		},
		function()
		{
			apprise("Could not save SWOT! Please refresh the page and try again.", null, null, container);
		}
		);
    });

	$('.swot-container input[type=text]').each(function(){
		$(this).val($(this).attr('watermark'));
	});
	$('.swot-container input[type=text]')
		.focus(function () {
			FocusTextArea($(this), $(this).attr('watermark'));
		})
		.blur(function () {
			BlurTextArea($(this), $(this).attr('watermark'));
		})
		.keydown(function (e) {
			if (e.keyCode == 13) {
				e.preventDefault();
				return false;
			}
		})
		.keyup(function(e) {
			if (e.keyCode == 13) {
				$(this).siblings('input:button').trigger('click');
				if (e.stopPropagation) {
					e.stopPropagation();
				} else { // Older IE.
					e.cancelBubble = true;
					e.returnValue = false;
				}
				return false;
			}
		})
		.keypress(function(e) {
			if (e.keyCode == 13) {
				if (e.stopPropagation) {
					e.stopPropagation();
				} else { // Older IE.
					e.cancelBubble = true;
					e.returnValue = false;
				}
				return false;
			}
		});
		
	$('.swot-list').on('mouseenter', '.swot-entry', function() {
		if($(this).attr('createdById') == MyEWCurrentUserId) {
			$(this).find('.remove-swot').show();
		}
	});
	$('.swot-list').on('mouseleave', '.swot-entry', function() {
		$(this).find('.remove-swot').hide();
	});
}


function GetSwotData(container) {

    var swotList = [];

    $(container).find(".swot-entry").each(function(index, element) {
        var swot =
        {
            creatorName: $(element).attr("created-by"),
            text: $(element).attr("swot-text"),
            createdOn: new Date().getDate(),
            type: $(element).attr("type"),
			createdBy: $(element).attr("createdById")
        };
        swotList[swotList.length] = swot;
    });
	
	var d = new Date();
	var milliseconds = d.getTime();
	
	var result = {
		swots:swotList,
		lastUser: GetCurrentUserName(),
		lastUpdate: milliseconds
	}

	return result;
}


function GetContainerHtml(firstTime, postId) {

    var strVar = "";
    strVar += " <div class=\"swot-container\">";
    if (!firstTime) {
        strVar += "      <div class=\"save-swot\" postId=\""+postId+"\">Click here to save this SWOT<\/div>";
    }
    strVar += "      <div class=\"line\">";
    strVar += "          <div class=\"strengths\">";
    strVar += "              <h1>Strengths<\/h1>";
    strVar += "              <div class=\"enter-swot\">";
    strVar += "        <input class=\"swot-text watermarked-text\" type=\"text\" watermark=\"Enter a strength...\" \/>";
    strVar += "        <input type=\"button\" value=\"Add\" class=\"myew-button add-swot\" watermark=\"Enter a strength...\" swot-type=\"strength\"\/>";
    strVar += "    <\/div>";
    strVar += "    <div class=\"strength-container swot-list\"><\/div>";
    strVar += "<\/div>";
    strVar += "<div class=\"weaknesses\">";
    strVar += "    <h1>Weaknesses<\/h1>";
    strVar += "    <div class=\"enter-swot\">";
    strVar += "        <input class=\"swot-text watermarked-text\" type=\"text\" watermark=\"Enter a weakness...\" \/>";
    strVar += "        <input type=\"button\" value=\"Add\" class=\"myew-button add-swot\" swot-type=\"weakness\" \/>";
    strVar += "    <\/div>";
    strVar += "    <div class=\"weakness-container swot-list\"><\/div>";
    strVar += "<\/div>";
    strVar += "<\/div>";
    strVar += "<div class=\"line\">";
    strVar += "    <div class=\"opportunities\">";
    strVar += "        <h1>Opportunities<\/h1>";
    strVar += "        <div class=\"enter-swot\">";
    strVar += "        <input class=\"swot-text watermarked-text\" type=\"text\" watermark=\"Enter an opportunity...\" \/>";
    strVar += "        <input type=\"button\" value=\"Add\" class=\"myew-button add-swot\" swot-type=\"opportunity\"\/>";
    strVar += "    <\/div>";
    strVar += "    <div class=\"opportunity-container swot-list\"><\/div>";
    strVar += "<\/div>";
    strVar += "<div class=\"threats\">";
    strVar += "    <h1>Threats<\/h1>";
    strVar += "    <div class=\"enter-swot\">";
    strVar += "        <input class=\"swot-text watermarked-text\" type=\"text\" watermark=\"Enter a threat...\" \/>";
    strVar += "        <input type=\"button\" value=\"Add\" class=\"myew-button add-swot\" swot-type=\"threat\"\/>";
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


function InjectSwot(outContainer, swot) {
	var container = "." + swot.type + "-container";   
	swot.text = unescape(swot.text);
	var html = '<div class="swot-entry" swot-text="' + escape(swot.text) + '" type="' + swot.type + '" created-by="' + swot.creatorName + '" createdById="' + swot.createdBy + '"><div class="remove-swot"></div><div class="swot-entry-text">' + swot.text + '</div><div class="swot-entry-creator">' + swot.creatorName +'</div></div>';
	$(outContainer).find(container).append(html);   	
}
 
function CreateSwot() { 
    var container = getPostDataContainer();
    $(container).html(GetContainerHtml(true));
	 $(container).fadeIn();
	bindMethods();
	DisablePostCreation('Please fill at least one swot entry');
}

function DisplaySwotsForPosts(additionalContent)
{
    var postType= PluginDictionary['Swot'];
    $.each(additionalContent, function (index, content) {
        if (content.PostType == postType)
        {
			//debugger;
			var container = $("#" + content.PostId);
            $(container).find(".post-text").after(GetContainerHtml(false,content.PostId));
			var content = JSON.parse(content.Content);
			var swots = content.swots;
			$.each(swots, function (index, swot) {
				InjectSwot(container, swot);
			});
			$(container).find(".swot-info").html("last update by "+content.lastUser +" - "+ $.easydate.format_date(new Date(content.lastUpdate)));
		}
    });
	bindMethods();
}

//bind the display
AddAdditionalContentWallCallback(DisplaySwotsForPosts);




