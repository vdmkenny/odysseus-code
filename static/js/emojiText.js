// static/js/emojiText.js
//
// Shared "Text-only Emojis" conversion: maps emoji glyphs to `:description:`
// text. Used by the markdown renderer (so streamed output is already text — no
// flash) and by app.js's deEmojify (one-shot conversion of already-rendered
// messages when the toggle is flipped on).

// Regex matching most emoji codepoints (Emoji_Presentation + common sequences,
// incl. ZWJ / variation-selector runs).
//
// The exported form is intentionally NON-global (`u` only) so callers can use
// `.test()` safely — a `g` flag makes `.test()` stateful (advances lastIndex)
// and would desync repeated tests. The replace-all path uses a private global.
const _EMOJI_PATTERN = '(?:\\p{Emoji_Presentation}|\\p{Extended_Pictographic})(?:\\uFE0F|\\u200D(?:\\p{Emoji_Presentation}|\\p{Extended_Pictographic}))*';
export const EMOJI_RE = new RegExp(_EMOJI_PATTERN, 'u');
const _EMOJI_RE_GLOBAL = new RegExp(_EMOJI_PATTERN, 'gu');

// Common emoji → text description map.
export const EMOJI_MAP = {
  '😀':'grinning','😃':'smiley','😄':'smile','😁':'grin','😆':'laughing','😅':'sweat smile',
  '🤣':'rofl','😂':'joy','🙂':'slightly smiling','🙃':'upside down','😉':'wink',
  '😊':'blush','😇':'innocent','🥰':'smiling hearts','😍':'heart eyes','🤩':'star struck',
  '😘':'kissing heart','😗':'kissing','😚':'kissing closed eyes','😙':'kissing smiling eyes',
  '🥲':'smiling tear','😋':'yum','😛':'tongue','😜':'winking tongue','🤪':'zany',
  '😝':'squinting tongue','🤑':'money mouth','🤗':'hugging','🤭':'hand over mouth',
  '🤫':'shushing','🤔':'thinking','🫡':'saluting','🤐':'zipper mouth','🤨':'raised eyebrow',
  '😐':'neutral','😑':'expressionless','😶':'no mouth','🫥':'dotted line face',
  '😏':'smirk','😒':'unamused','🙄':'eye roll','😬':'grimacing','🤥':'lying',
  '😌':'relieved','😔':'pensive','😪':'sleepy','🤤':'drooling','😴':'sleeping',
  '😷':'mask','🤒':'thermometer','🤕':'head bandage','🤢':'nauseated','🤮':'vomiting',
  '🥵':'hot','🥶':'cold','🥴':'woozy','😵':'dizzy','🤯':'exploding head',
  '🤠':'cowboy','🥳':'party','🥸':'disguised','😎':'sunglasses','🤓':'nerd',
  '🧐':'monocle','😕':'confused','🫤':'diagonal mouth','😟':'worried','🙁':'slightly frowning',
  '😮':'open mouth','😯':'hushed','😲':'astonished','😳':'flushed','🥺':'pleading',
  '🥹':'holding back tears','😦':'frowning open mouth','😧':'anguished','😨':'fearful',
  '😰':'anxious sweat','😥':'sad relieved','😢':'crying','😭':'sobbing','😱':'screaming',
  '😖':'confounded','😣':'persevering','😞':'disappointed','😓':'downcast sweat',
  '😩':'weary','😫':'tired','🥱':'yawning','😤':'triumph','😡':'pouting',
  '😠':'angry','🤬':'swearing','😈':'smiling devil','👿':'angry devil',
  '💀':'skull','☠️':'skull crossbones','💩':'poop','🤡':'clown','👹':'ogre','👺':'goblin',
  '👻':'ghost','👽':'alien','👾':'space invader','🤖':'robot',
  '😺':'smiling cat','😸':'grinning cat','😹':'tears of joy cat','😻':'heart eyes cat',
  '😼':'wry cat','😽':'kissing cat','🙀':'weary cat','😿':'crying cat','😾':'pouting cat',
  '🙈':'see no evil','🙉':'hear no evil','🙊':'speak no evil',
  '👋':'wave','🤚':'raised back of hand','🖐️':'hand with fingers splayed','✋':'raised hand',
  '🖖':'vulcan salute','🫱':'rightward hand','🫲':'leftward hand',
  '👌':'ok hand','🤌':'pinched fingers','🤏':'pinching hand','✌️':'victory',
  '🤞':'crossed fingers','🫰':'hand with index finger and thumb crossed',
  '🤟':'love you','🤘':'rock on','🤙':'call me','👈':'point left','👉':'point right',
  '👆':'point up','🖕':'middle finger','👇':'point down','☝️':'index up',
  '🫵':'point at viewer','👍':'thumbs up','👎':'thumbs down','✊':'raised fist',
  '👊':'fist bump','🤛':'left fist','🤜':'right fist','👏':'clap','🙌':'raising hands',
  '🫶':'heart hands','👐':'open hands','🤲':'palms up','🤝':'handshake','🙏':'pray',
  '✍️':'writing','💅':'nail polish','🤳':'selfie','💪':'flexed biceps',
  '❤️':'red heart','🧡':'orange heart','💛':'yellow heart','💚':'green heart',
  '💙':'blue heart','💜':'purple heart','🖤':'black heart','🤍':'white heart',
  '🩷':'pink heart','🩵':'light blue heart','🩶':'grey heart','🤎':'brown heart',
  '💔':'broken heart','❤️‍🔥':'heart on fire','❤️‍🩹':'mending heart',
  '💕':'two hearts','💞':'revolving hearts','💓':'heartbeat','💗':'growing heart',
  '💖':'sparkling heart','💘':'heart with arrow','💝':'heart with ribbon',
  '💟':'heart decoration','🔥':'fire','💯':'100','✨':'sparkles','⭐':'star',
  '🌟':'glowing star','💫':'dizzy star','🎉':'party popper','🎊':'confetti ball',
  '🎈':'balloon','🎁':'gift','🏆':'trophy','🥇':'1st place','🥈':'2nd place','🥉':'3rd place',
  '⚡':'zap','💡':'light bulb','🔑':'key','🔒':'locked','🔓':'unlocked',
  '🔔':'bell','🔕':'bell off','📢':'loudspeaker','📣':'megaphone',
  '💬':'speech bubble','💭':'thought bubble','🗯️':'anger bubble',
  '✅':'check mark','❌':'cross mark','❓':'question','❗':'exclamation',
  '⚠️':'warning','🚫':'prohibited','⛔':'no entry','🔴':'red circle','🟢':'green circle',
  '🔵':'blue circle','🟡':'yellow circle','⚪':'white circle','⚫':'black circle',
  '🟠':'orange circle','🟣':'purple circle','🟤':'brown circle',
  '📁':'folder','📂':'open folder','📄':'document','📝':'memo','📎':'paperclip',
  '📌':'pin','📍':'round pin','🔗':'link','📊':'bar chart','📈':'chart up','📉':'chart down',
  '🔍':'magnifying glass left','🔎':'magnifying glass right',
  '🌐':'globe','🌍':'globe europe','🌎':'globe americas','🌏':'globe asia',
  '🕐':'clock 1','🕑':'clock 2','🕒':'clock 3','🕓':'clock 4',
  '⏰':'alarm clock','⏳':'hourglass flowing','⌛':'hourglass done',
  '🚀':'rocket','✈️':'airplane','🚗':'car','🚂':'train','🚢':'ship',
  '🏠':'house','🏢':'building','🏗️':'construction','🏭':'factory',
  '🎵':'musical note','🎶':'musical notes','🎤':'microphone','🎧':'headphones',
  '📷':'camera','📸':'camera flash','🎬':'clapperboard','📺':'television',
  '💻':'laptop','🖥️':'desktop','📱':'mobile phone','☎️':'telephone',
  '🔧':'wrench','🔨':'hammer','⚙️':'gear','🧲':'magnet','🧪':'test tube','🔬':'microscope',
  '📚':'books','📖':'open book','✏️':'pencil','🖊️':'pen','🖋️':'fountain pen',
  '🎯':'bullseye','♟️':'chess pawn','🎲':'game die','🧩':'puzzle piece',
  '🍕':'pizza','🍔':'burger','🍟':'fries','🌮':'taco','🍣':'sushi','🍩':'donut',
  '☕':'coffee','🍺':'beer','🍷':'wine','🥤':'cup with straw',
  '🐶':'dog','🐱':'cat','🐭':'mouse','🐹':'hamster','🐰':'rabbit','🦊':'fox',
  '🐻':'bear','🐼':'panda','🐨':'koala','🐯':'tiger','🦁':'lion','🐮':'cow',
  '🐷':'pig','🐸':'frog','🐵':'monkey','🐔':'chicken','🐧':'penguin','🐦':'bird',
  '🦅':'eagle','🦆':'duck','🦉':'owl','🐺':'wolf','🐗':'boar','🐴':'horse',
  '🦄':'unicorn','🐝':'bee','🐛':'bug','🦋':'butterfly','🐌':'snail','🐞':'ladybug',
  '🐍':'snake','🐢':'turtle','🐙':'octopus','🦀':'crab','🐠':'tropical fish',
  '🐳':'spouting whale','🐋':'whale','🦈':'shark','🐊':'crocodile','🦕':'sauropod','🦖':'t-rex',
  '🌸':'cherry blossom','🌹':'rose','🌻':'sunflower','🌺':'hibiscus','🌷':'tulip',
  '🌱':'seedling','🌲':'evergreen tree','🌳':'deciduous tree','🍀':'four leaf clover',
  '🍎':'red apple','🍐':'pear','🍊':'tangerine','🍋':'lemon','🍌':'banana',
  '🍉':'watermelon','🍇':'grapes','🍓':'strawberry','🫐':'blueberries','🍑':'peach',
  '🌈':'rainbow','☀️':'sun','🌤️':'sun behind cloud','⛅':'sun behind cloud','☁️':'cloud',
  '🌧️':'rain','⛈️':'thunder','❄️':'snowflake','🌊':'wave',
  '👀':'eyes','👁️':'eye','👂':'ear','👃':'nose','👄':'mouth','👅':'tongue',
  '🧠':'brain','🦴':'bone','🦷':'tooth','👶':'baby','🧒':'child','👦':'boy','👧':'girl',
  '🧑':'person','👨':'man','👩':'woman','🧓':'older person',
  '👮':'police officer','🧑‍💻':'technologist','👨‍💻':'man technologist',
  '👩‍💻':'woman technologist',
  '🎓':'graduation cap','🧢':'billed cap','👑':'crown','💎':'gem','👓':'glasses','🕶️':'sunglasses',
  '🩸':'drop of blood','💊':'pill','🩹':'bandage','🧬':'dna','🦠':'microbe',
  '☢️':'radioactive','☣️':'biohazard','♻️':'recycling',
  '🏳️':'white flag','🏴':'black flag','🚩':'red flag','🏁':'checkered flag',
  '➡️':'right arrow','⬅️':'left arrow','⬆️':'up arrow','⬇️':'down arrow',
  '↗️':'upper right arrow','↘️':'lower right arrow','↙️':'lower left arrow','↖️':'upper left arrow',
  '↩️':'left curve','↪️':'right curve','🔄':'counterclockwise','🔃':'clockwise',
  '➕':'plus','➖':'minus','➗':'division','✖️':'multiply','♾️':'infinity',
  '‼️':'double exclamation','⁉️':'exclamation question',
  '©️':'copyright','®️':'registered','™️':'trademark',
};

/** Replace emoji glyphs in a string with `:description:` text. */
export function emojiToText(str) {
  return str.replace(_EMOJI_RE_GLOBAL, (match) => {
    const desc = EMOJI_MAP[match];
    if (desc) return ':' + desc + ':';
    // Unmapped emoji → generic marker rather than leaving the glyph.
    return ':emoji:';
  });
}
