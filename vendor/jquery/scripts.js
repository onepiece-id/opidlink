var firestore = firebase.firestore();

const docRef = firebase.doc("onepiece-id/link");
const outputHeader = document.querySelector("#deresult");
const inputTextField = document.querySelector("#resultLink");
const createLink = document.querySelector('#createLink');
const decreateLink = document.querySelector('#decreateLink');

var key = "AIzaSyBshG52jnls19vWfbpkUbNRJz2Gy0WG5Lc";

var db = new Dexie("links_DB");
db.version(1).stores({
  links: 'short,full'
});

createLink.addEventListener("click", function () {
  const textToSave = inputTextField.Value;
  console.log("Membuat Link" + textToSave + " ke Firestore");
  docRef.set({
    resultLink: textToSave
  }).then(function () {
    console.log("Status Saved");
  }).catch(function (error) {
    console.log("Got an error: ", error);
  });
});

decreateLink.addEventListener("click", function () {
  docRef.get().then(function (doc) {
    if (doc && doc.exit) {
      const myData = doc.data();
      outputHeader.innerText = myData.resultLink;
    }
  }).catch(function (error) {
    console.log("Got an error: ", error);
  });
});

function createLink() {
  $('#createl').html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Wait');
  var lurl = $('#lurl').val();

  var data = JSON.stringify({
    "dynamicLinkInfo": {
      "dynamicLinkDomain": "opid.page.link",
      "link": lurl
    },
    "suffix": {
      "option": "UNGUESSABLE"
    }
  });

  var xhr = new XMLHttpRequest();
  //xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText);
      var newLink = (JSON.parse(this.responseText)).shortLink;
      $('#resultLink').text(newLink);
      $('#resultLink').attr("href", newLink);
      $('#resultLink').attr("target", "_blank");
      $('#comp-icon').hide();
      $('#qrcode').empty();
      $('#qrcode').qrcode({
        width: 200,
        height: 200,
        text: newLink
      });

      db.links.put({
        short: newLink,
        full: lurl
      }).then(function () {
        return db.links.get(newLink);
      }).then(function (link) {
        //alert(link.full+' = '+link.short);
      }).catch(function (error) {
        alert(error);
      });
      listAllLinks();
      $('#createl').html('<i class="fas fa-link"></i> Create');
    }
  });

  xhr.open("POST",
    "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=" + key
  );
  xhr.setRequestHeader("content-type", "application/json");

  xhr.send(data);

}

function listAllLinks() {
  db.links.count(function (count) {
    $('#tableName').html('Available links <span class="badge badge-primary">' + count + '</span>');
  });

  db.links.each(link => $('#ltable').append('<li class="list-group-item"><em>' + link.full + '</em> was shotened to <em>' + link.short + '</em></li>'));
}

listAllLinks();

function decreateLink() {
  $('#decreatel').html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Wait');
  var surl = $('#surl').val();
  db.links.get(surl).then(function (link) {
    $('#deresult').text(link.full);
    $('#deresult').attr("href", link.full);
    $('#deresult').attr("target", "_blank");
    $('#decreatel').html('<i class="fas fa-unlink"></i> Show');
  });
}