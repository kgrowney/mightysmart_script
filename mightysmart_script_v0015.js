$(document).ready(function() {
    
        const firebaseConfig = {
            apiKey: "AIzaSyDOBc9iKIXam9FENPPMQQyrs36eCtCjewA",
            authDomain: "produck-brief.firebaseapp.com",
            databaseURL: "https://produck-brief.firebaseio.com",
            projectId: "produck-brief",
            storageBucket: "produck-brief.appspot.com",
            messagingSenderId: "1016070241292",
            appId: "1:1016070241292:web:51ef9a209cab6c2f074229",
            measurementId: "G-FBGNXHGX1Y"
        };
    
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
    
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                $(".logoutdropdown").removeClass('hide');
                //console.log(user);
                var uid = user.uid;
                console.log('UID: ' + user.uid);
                console.log('EMAIL: ' + user.email);
                localStorage.setItem("userId", user.uid);
                localStorage.setItem("useremail", user.email);
                var providerId = user.providerData[0].providerId;
                //match
    
                $(".tags-popu-content.loggedout").addClass("hide");
                $(".skill-tags-slides.loggedin").removeClass("hide");
    
                // $(".usertitle").text(user.displayName);
    
                if (providerId != "" && providerId != null && (providerId == "google.com" || providerId == "facebook.com")) {
                    if (user.photoURL != "" && user.photoURL != null) {
                        localStorage.setItem('photoUrl', user.photoURL);
                        if ($("#userPhoto").length > 0) {
                            $("#userImage, #userPhoto").attr('src', user.photoURL);
                            $('.profilephoto').addClass('d-none');
                            $('.userImg').removeClass('d-none');
                        }
                    }
                }
            } else {
                // User is signed out
                localStorage.removeItem("useremail");
                console.log('User is signed out')
                localStorage.removeItem('photoUrl');
                localStorage.removeItem('userId');
                localStorage.removeItem('userdata');
    
            }
        });
    
        $("#facebookLogin").click(function() {
    
            var provider = new firebase.auth.FacebookAuthProvider();
    
            firebase.auth()
                .signInWithRedirect(provider)
                // .getRedirectResult()
                .then((result) => {
                    // The signed-in user info.
                    var user = result.user;
    
                }).catch((error) => {
                    var errorMessage = error.message;
                    console.log(errorMessage);
                });
        });
    
        $("#googleLogin").click(function() {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider);
            firebase.auth()
                .getRedirectResult()
                .then((result) => {
                    var user = result.user;
                    //console.log(user);
                }).catch((error) => {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorMessage);
                    console.log(errorCode);
                });
    
        })
    
        $("#twitterLogin").click(function() {
            var provider = new firebase.auth.TwitterAuthProvider();
            firebase.auth().signInWithRedirect(provider);
            firebase.auth()
                .getRedirectResult()
                .then((result) => {
                    var user = result.user;
                    //console.log(user);
                }).catch((error) => {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorMessage);
                    console.log(errorCode);
                });
        })

        $("#signout").click(function() {
            firebase.auth().signOut().then(() => {
                localStorage.removeItem("useremail");
                localStorage.removeItem('photoUrl');
                localStorage.removeItem('userId');
                localStorage.removeItem('userdata');
                location.reload();
            }).catch((error) => { console.log("error here") });
        })

        $(".user-profile-img").on("click", function() {
            if (!firebase.auth().currentUser) {
                var e = $(".design-button a.skillitem").first(),
                    skilldescription = $(e).find(".skilldescription").text(),
                    usertag = $(e).find(".usertags").text(),
                    skillcounter = $(e).find(".skills-count").text();
                $(".tags-popu-content .skill-name").text(usertag);
                $(".tags-popu-content .skill-desription-box").html(skilldescription);
                $(".tags-popu-content .skill-counter").html(skillcounter);
                $("#skillsSection").removeClass("hide");
            }
        });
    
        $(document).on('click', ".skillitem", function() {
            $("#skillsSection").removeClass('hide');
            // var user = firebase.auth().currentUser;
            // if (user) { return false; } else {
                var skilldescription = $(this).find(".skilldescription").text();
                var usertags = $(this).find('.usertags').text();
                var userscount = $(this).find('.skills-count').text();
                $(".tags-popu-content .skill-name").text(usertags);
                $(".tags-popu-content .skill-desription-box").html(skilldescription);
                $(".tags-popu-content .skill-counter").html(userscount);
    
                // $("#skillBox").html("");
    
                $(".skill-tags-slides.loggedin").html("");
                var data = localStorage.getItem('userdata');
                data = JSON.parse(data);
                if ((data.skills) && data.skills.length > 0) {
                    let i = 0;
                    for (const skill of data.skills) {
                        if (skill != "" && (skill.skillTag).trim() == (usertags.trim().replace('#', ""))) {
                            var endrosements = (skill.endorsements && skill.endorsements.length > 0) ? skill.endorsements.length : 0;
    
                            $(".usertagsample .skilldescription").text(skill.skillSummary);
                            $(".usertagsample .usertags").text("#" + skill.skillTag);
                            $(".usertagsample .skills-count").html("(" + endrosements + ")");
    
    
                            var skilltagsitems = $("#Skill-tags-Slides .tags-popu-content");
                            $(skilltagsitems).find(".skill-name").html("#" + skill.skillTag);
                            $(skilltagsitems).find(".tag-discription").html(skill.skillSummary);
                            $(skilltagsitems).find(".button-agree").attr('data-index', i);
                            $(skilltagsitems).find(".tagged-success-msg p").text("You've given Kevin a skilltag for " + skill.skillTag);
                            var skilltags = skill.endorsements;
                            var userId = localStorage.getItem('userId');
                            console.log(userId);

                            $(skilltagsitems).find(".button-agree").removeAttr("data-skilltagged");
                            $(skilltagsitems).find(".button-agree .social-heading").text('Endorse SkillTag');
                            if (skilltags) {
                                for (const skilltag of skilltags) {
                                    if (skilltag != null && skilltag.endorsee == userId) {
                                        console.log(skilltag.endorsee);
                                        console.log("This tag is already endorsed.");
                                        $(".success-message, .button-agree").css('background-color', data.primaryColor);
                                        
                                        $(skilltagsitems).find(".button-agree").attr("data-skilltagged", userId);
                                        $(skilltagsitems).find(".button-agree .social-heading").text('Endorsed SkillTag');
                                    }
                                }
                            }

                            $(skilltagsitems).find(".button-agree").attr('data-counter', endrosements);
                            $(skilltagsitems).find(".skill-counter").html("(" + endrosements + ")");
    
                            var skillstagsblock = $("#Skill-tags-Slides").html();
                            $(".skill-tags-slides.loggedin").append(skillstagsblock);
    
                            var userskills = $(".usertagsample").html();
                            // console.log(userskills);
                            // $("#skillBox").append(userskills);
    
                        }
                        i++;
                    }
                }
    
            // }
        })
    
        $(document).on("click", ".button-agree", function() {
            var endrosed = ($(this).attr('data-skilltagged') != null) ? 'endrosed' : '';
            console.log(endrosed);
            var skillindex = $(this).attr('data-index');
            const ref = firebase.database().ref("users/"+userID+"/skills/" + skillindex + "/endorsements/");
    
            ref.get().then((snapshot) => {
                var userfbdata = firebase.auth().currentUser;
    
                var userinfo = localStorage.getItem('userdata');
                userinfo = JSON.parse(userinfo);
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    var skilltags = snapshot.val();
                    var endorsementid = skilltags.length;
                    for (const skilltag of skilltags) {
                        if (skilltag) {
                            if (skilltag != null && skilltag.endorsee == userfbdata.uid) {
                                console.log(skilltag.endorsee);
                                console.log("This tag is already endorsed.");
                                $(this).closest(".skill-tagged-desc").addClass("hide");
                                $(this).closest(".social-logins").find(".tagged-success-msg p").text("You've already endorsed this skilltag.");
                                $(this).closest(".social-logins").find(".tagged-success-msg").removeClass("hide");
                                return false;
                            } else {
                                console.log(skilltag.endorsee + " OTHER ");
                            }
                        }
                    }
                } else {
                    var endorsementid = 0;
                    console.log("No data available");
                }
    
    
                var summary = userinfo.summary;
                var profileImage = userinfo.profileImg;
                var linkURL = userinfo.myWebsiteURL;
    
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                var today = dd + '/' + mm + '/' + yyyy;
                var dataset = {
                    endorseComment: summary,
                    endorseDate: today,
                    endorseImage: profileImage,
                    endorseLink: linkURL,
                    endorsee: userfbdata.uid
                };
    
                ref.child(endorsementid).set(dataset, (error) => {
                    if (error) {
                        console.log(error);

                    } else {
                        var endorsements_count = parseInt(endorsementid) + 1
                        firebase.database().ref("users/"+userID+"/skills/" + skillindex).update({ tagCounter: endorsements_count }, (error) => {
                            if (error) {
                    
                                console.log(error);
                            } else {
                                getUserInfo(userID, function afterResult(data) {

                                    //console.log(data);
                                    localStorage.setItem("userdata", JSON.stringify(data));

                                    $("#skillBox").html("");
                                    if ((data.skills) && data.skills.length > 0) {
                                        let i = 0;
                                        for (const skill of data.skills) {
                                            if (skill != "" && skill != null) {
                                                var endrosements = 0;
                                                if ((skill.endorsements) && skill.endorsements.length > 0) {
                                                    for (const endorse of skill.endorsements) {
                                                        if (endorse != "" && endorse != null) {
                                                            endrosements++;
                                                        }
                                                    }
                                                }
                                                $(".usertagsample .skilldescription").text(skill.skillSummary);
                                                $(".usertagsample .usertags").text("#" + skill.skillTag);
                                                $(".usertagsample .skills-count").html("(" + endrosements + ")");
                                                var userskills = $(".usertagsample").html();
                                                $("#skillBox").append(userskills);
                                                i++;
                                            }
                                        }
                                    }
        
                                });

                                console.log("tag conter updated");
                                $(this).closest(".social-logins").find(".skill-counter").html("("+endorsements_count+")");
                                $(this).closest(".skill-tagged-desc").addClass("hide");
                                $(this).closest(".social-logins").find(".tagged-success-msg").removeClass("hide");

                            }
                        })
                    }
                })
            }).catch((error) => {
                console.error(error);
            });
    
        })
        $(document).on("click", ".close-btn", function() {
            $("#skillsSection").addClass('hide');
        })
    
    


    async function getUserInfo(user_id, callback) {
        const API_URL = "https://produck-brief.firebaseio.com";
        const resp = await fetch(API_URL + "/users/" + user_id + ".json", {});
        callback((await resp.json()) || []);
    }

    getUserInfo(userID, function afterResult(data) {

        //console.log(data);
        localStorage.setItem("userdata", JSON.stringify(data));

        var brandsLogo = data.brandsLogo;
        var ContainerTransparent = (data.ContainerTransparent) ? percentToHex((data.ContainerTransparent) * 100) : 0;
        var containerBgColor = data.containerColor + ContainerTransparent;

        $("#user-companyLogo").attr('src', brandsLogo);
        $("#ms-section_wrapper").css({ 'background-image': "url(" + data.userShareImg + ")", "background-repeat": "no-repeat", "background-size": "cover", "background-color": containerBgColor, "border-bottom": "5px solid " + data.primaryColor });
        $("#user-title").html(data.title).css('color', data.secondaryColor);
        $(".ms-content_wrapper").css('background-color', containerBgColor);
        $(".design-button-ux").css('background-color', data.secondaryColor);
        $("#contactSubmit, .nav-tag").css('background', data.primaryColor);
        $(".skill-tagged-name, .tag-heading-20").css('color', data.primaryColor);
        $(".success-message, .button-agree").css('background-color', data.primaryColor);

        $(".profile-image").css('background', data.primaryColor + ContainerTransparent);
        //$("#companyPrimaryColor").css({ 'background': data.containerColor + ContainerTransparent, "border-color": data.company[0].companyStrokeColor });
        $("#companyPrimaryColor").css({ "border-color": (data.company) ? data.company[0].companyStrokeColor : "#000" });
        $(".skills-section").css({ 'background-color': data.primaryColor + ContainerTransparent })

        $("#user-profileImage").attr("src", data.profileImg);
        $("#user-endorseUserName").html(data.name);
        $("#user-workSummary").html(data.summary);
        $("#user-linkURL").attr('href', data.linkURL);
        $("#user-primaryLinkTitle").html(data.primaryLinkTitle);
        if (data.links) {
            /** social links */
            if ((data.links.behanceURL) && data.links.behanceURL.trim() != "") { $("#user-behanceURL").attr('href', data.links.behanceURL).removeClass('no-link-found'); }
            if ((data.links.dribbbleURL) && data.links.dribbbleURL.trim() != "") { $("#user-dribbbleURL").attr('href', data.links.dribbbleURL).removeClass('no-link-found'); }
            if ((data.links.etsyURL) && data.links.etsyURL.trim() != "") { $("#user-etsyURL").attr('href', data.links.etsyURL).removeClass('no-link-found'); }
            if ((data.links.facebookURL) && data.links.facebookURL.trim() != "") { $("#user-facebookURL").attr('href', data.links.facebookURL).removeClass('no-link-found'); }
            if ((data.links.instagramURL) && data.links.instagramURL.trim() != "") { $("#user-instagramURL").attr('href', data.links.instagramURL).removeClass('no-link-found'); }
            if ((data.links.linkedinURL) && data.links.linkedinURL.trim() != "") { $("#user-linkedinURL").attr('href', data.links.linkedinURL).removeClass('no-link-found'); }
            if ((data.links.mediumURL) && data.links.mediumURL.trim() != "") { $("#user-mediumURL").attr('href', data.links.mediumURL).removeClass('no-link-found'); }
            if ((data.links.myWebsiteURL) && data.links.myWebsiteURL.trim() != "") { $("#user-myWebsiteURL").attr('href', data.links.myWebsiteURL).removeClass('no-link-found'); }
            if ((data.links.myWebsiteURL) && data.links.myWebsiteURL.trim() != "") { $("#user-myWebsiteURL").attr('href', data.links.myWebsiteURL).removeClass('no-link-found'); }
            if ((data.links.pinterestURL) && data.links.pinterestURL.trim() != "") { $("#user-pinterestURL").attr('href', data.links.pinterestURL).removeClass('no-link-found'); }
            if ((data.links.quoraURL) && data.links.quoraURL.trim() != "") { $("#user-quoraURL").attr('href', data.links.quoraURL).removeClass('no-link-found'); }
            if ((data.links.snapchatURL) && data.links.snapchatURL.trim() != "") { $("#user-snapchatURL").attr('href', data.links.snapchatURL).removeClass('no-link-found'); }
            if ((data.links.ticktokURL) && data.links.ticktokURL.trim() != "") { $("#user-ticktokURL").attr('href', data.links.ticktokURL).removeClass('no-link-found'); }
            if ((data.links.twitchURL) && data.links.twitchURL.trim() != "") { $("#user-twitchURL").attr('href', data.links.twitchURL).removeClass('no-link-found'); }
            if ((data.links.twitterURL) && data.links.twitterURL.trim() != "") { $("#user-twitterURL").attr('href', data.links.twitterURL).removeClass('no-link-found'); }
            if ((data.links.youtubeURL) && data.links.youtubeURL.trim() != "") { $("#user-youtubeURL").attr('href', data.links.youtubeURL).removeClass('no-link-found'); }
        }
        // POSTS Box where posts will append
        var postContainer = $("#PostsContainer");

        $(".dynamic_text").css("opacity", 1);
        $(".page-loader").addClass('hide');

        $(".ms-card1_description-wrapper").css("border-left", "2px solid " + data.accentColor);
        $(".ms-card1_medium-text.postlinktitle").css("color", data.accentColor)


        $(postContainer).html("");
        var tagblock = $("#tagsBlock");

        if ((data.posts) && data.posts.length > 0) {
            var counter = 0;
            for (const postItem of data.posts) {

                counter = counter++;
                var postBlock = $("#postblockBox .postblock");
                $(postBlock).find("#post-postTags").html("");

                var postTitle = postItem.postTitle;
                var linkURL = postItem.linkURL;
                var postComments = postItem.postComments;
                var postDate = postItem.postDate;
                var postImg = postItem.postImg;
                var postLinkTitle = getDomain(linkURL);
                var postTags = postItem.postTags;
                $("#postblockBox .post-postlink").attr('href', linkURL);

                if (postTags.length > 0) {
                    var tagsData = $(postBlock).find("#post-postTags");
                    for (const postTag of postTags) {
                        if (postTag != null) {
                            $(tagblock).find('span').text('#' + postTag);
                            $(tagsData).append($(tagblock).html());
                        }
                    }
                }
                $(postBlock).find("#post-postTitle").html(postTitle);
                $(postBlock).find("#post-postImg").attr('src', postImg).attr('srcset', postImg);
                $(postBlock).find("#post-postComments").html(postComments);
                $(postBlock).find("#post-postDate").html(postDate);
                $(postBlock).find("#post-postLinkTitle").html(postLinkTitle);
                $(postContainer).append($("#postblockBox").html());
            }
        }

        $("#skillBox").html("");
        if ((data.skills) && data.skills.length > 0) {
            let i = 0;
            for (const skill of data.skills) {
                if (skill != "" && skill != null) {
                    var endrosements = 0;
                    if ((skill.endorsements) && skill.endorsements.length > 0) {
                        for (const endorse of skill.endorsements) {
                            if (endorse != "" && endorse != null) {
                                endrosements++;
                            }
                        }
                    }
                    $(".usertagsample .skilldescription").text(skill.skillSummary);
                    $(".usertagsample .usertags").text("#" + skill.skillTag);
                    $(".usertagsample .skills-count").html("(" + endrosements + ")");
                    var userskills = $(".usertagsample").html();
                    $("#skillBox").append(userskills);

                    i++;
                }
            }
        }

    });
});
    
const percentToHex = (p) => {
    const percent = Math.max(0, Math.min(100, p)); // bound percent from 0 to 100
    const intValue = Math.round(p / 100 * 255); // map percent to nearest integer (0 - 255)
    const hexValue = intValue.toString(16); // get hexadecimal representation
    return hexValue.padStart(2, '0').toUpperCase();
}

function getDomain(url, subdomain) {
    subdomain = subdomain || false;
    url = url.replace(/(https?:\/\/)?(www.)?/i, '');
    if (!subdomain) {
        url = url.split('.');
        url = url.slice(url.length - 2).join('.');
    }
    if (url.indexOf('/') !== -1) {
        return url.split('/')[0];
    }
    return url;
}


$(document).on("click", ".close-btn", function() {
    $("#skillsSection").addClass('hide');
})
    
$('.skills-section').on('click', function(e) {
    if (e.target !== this)
        return;
    $("#skillsSection").addClass('hide');
});
