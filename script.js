// Simple frontend-only NPC randomizer
const firstNames = ["Maggie","Rick","Lena","Daryl","Troy","Jules","Maya","Frank","Ike","Gwen","Ruth","Carlos","Hanna","Otto","June"]
const lastNames = ["Hale","Turner","Cole","Marsh","Reed","Hawkins","Voss","Klein","Drake","Nash"]
const occupations = ["Scavenger","Medic","Soldier","Mechanic","Trader","Scout","Farmer","Cook"]
const traits = ["Scarred","Cautious","Brave","Paranoid","Charismatic","Silent","Quick-thinking","Stubborn"]
const flaws = ["Trust issues","Short temper","Claustrophobic","Addicted to gambling","Claustrophobic","Loyal to a fault"]
const secrets = ["Loses people in the night","Saved someone they shouldn't have","Used to be a cop","Hoarder of canned food","Knows a hidden cache location"]
const goals = ["Find family","Join a community","Keep moving","Protect someone","Gather supplies","Learn a trade"]

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] }
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min }

function generateNPC(){
  const name = `${pick(firstNames)} ${pick(lastNames)}`
  const age = randInt(18,65)
  const occupation = pick(occupations)
  const trait = pick(traits)
  const flaw = pick(flaws)
  const secret = pick(secrets)
  const goal = pick(goals)
  const wounds = randInt(0,4)
  const backstory = `Age ${age}. ${occupation}. ${trait}. ${flaw}. Secret: ${secret}. Goal: ${goal}. Wounds: ${wounds}.` 
  return {name, age, occupation, trait, flaw, secret, goal, wounds, backstory}
}

function render(npc){
  document.getElementById('npc-name').textContent = npc.name
  const list = document.getElementById('npc-list')
  list.innerHTML = ''
  const items = [
    `Age: ${npc.age}`,
    `Occupation: ${npc.occupation}`,
    `Trait: ${npc.trait}`,
    `Flaw: ${npc.flaw}`,
    `Wounds: ${npc.wounds}`
  ]
  items.forEach(t=>{ const li = document.createElement('li'); li.textContent = t; list.appendChild(li) })
  document.getElementById('npc-backstory').textContent = npc.backstory
}

function downloadJSON(npc){
  const blob = new Blob([JSON.stringify(npc, null, 2)], {type:'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${npc.name.replace(/\s+/g,'_')}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}

function copyToClipboard(npc){
  const text = `${npc.name}\n${npc.backstory}`
  if(navigator.clipboard){ navigator.clipboard.writeText(text).then(()=>alert('Copied to clipboard')) } else { prompt('Copy:', text) }
}

// Wire up UI
const generateBtn = document.getElementById('generate')
generateBtn.addEventListener('click', ()=>{ const npc = generateNPC(); render(npc); window.latestNPC = npc })

document.getElementById('download').addEventListener('click', ()=>{ if(window.latestNPC) downloadJSON(window.latestNPC); else alert('Generate an NPC first') })
document.getElementById('copy').addEventListener('click', ()=>{ if(window.latestNPC) copyToClipboard(window.latestNPC); else alert('Generate an NPC first') })

// Auto-generate one on loadndocument.addEventListener('DOMContentLoaded', ()=>{ const npc = generateNPC(); render(npc); window.latestNPC = npc })