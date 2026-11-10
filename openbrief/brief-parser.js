(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  if(root)root.OpenBriefBriefParser=api;
})(typeof globalThis==="object"?globalThis:this,function(){
  "use strict";
  const fieldRules=[
    {key:"purpose",label:"Purpose / skill tested",pattern:/\b(evaluat(?:e|es|ed|ing)|assess(?:es|ing)?\s+(?:your|the|a|candidate|practical|technical|problem|engineering|backend|software|coding)|demonstrat(?:e|es|ed|ing)|skills? (?:being )?assessed|we are looking for|designed to assess|purpose of this (?:exercise|assessment)|checks? whether|test(?:s|ed|ing)?\s+(?:your|the|practical|technical|coding|design|analytical))\b/i},
    {key:"deliverables",label:"Scope / deliverables",pattern:/\b(submission|deliverable|deliver|build|create|implement|develop|provide|prepare|upload|github|(?:repo|repository) (?:link|url)|presentation|report|prototype|working demo|deploy|live url|source code|one-page note|walkthrough|demo link|loom|video recording|case study|submit (?:a|the|your)\b)\b/i},
    {key:"rubric",label:"Evaluation criteria",pattern:/\b(rubric|evaluation criteria|assessment criteria|criteria|scored|grading|graded|assessed on|we will assess|we evaluate|weightage|weights|selection criteria|percentage|quality of thinking|code quality|creativity|correctness)\b/i},
    {key:"ai_policy",label:"Permitted tools / AI policy",pattern:/\b(ai (?:coding )?tools?|artificial intelligence tools?|chatgpt|copilot|cursor|claude|llm|generative ai|use of ai|ai (?:is )?(?:allowed|permitted|prohibited|banned|not allowed|not permitted|welcome|fine)|tools? (?:are )?(?:allowed|permitted|prohibited)|do not use (?:ai|chatgpt|copilot)|must not use (?:ai|chatgpt|copilot)|ai help is (?:welcome|fine)|ai tools? (?:may|can) be used|ai tools? are expected|we expect (?:candidates )?to use ai|may use ai as much as (?:you|they) like|ai assistance (?:is )?(?:allowed|permitted|welcome)|use ai as much as you like)\b/i},
    {key:"compensation",label:"Compensation",pattern:/(?:\b(paid|unpaid|stipend|compensation|remuneration|inr\b|rs\.?\s?\d|rupees?|payment|honorarium|paid on submission|paid upon submission)\b|₹\s?\d)/i},
    {key:"ip_rights",label:"IP / reuse rights",pattern:/\b(intellectual property|ownership|own the work|work product|reuse|portfolio|licen[cs]e|assign(?:ment)? of rights|copyright|nda|non-disclosure|confidentiality|ip assignment)\b/i},
    {key:"data_use",label:"Data use / AI evaluation",pattern:/\b(data retention|retain|retention|delete|deletion|store|stored|recording|automated evaluation|ai evaluation|evaluated by ai|personal data|privacy|third[- ]party|answers? (?:are )?not (?:retained|stored|shared)|answers?[^.]{0,120}not (?:retained|stored|shared))\b/i},
    {key:"feedback",label:"Feedback / decision timeline",pattern:/\b(feedback|hear back|decision|response timeline|results by|reply within|respond within|outcome|next steps|updates? (?:at|throughout|after) each stage|every applicant hears|final answer|final result|share the outcome)\b/i},
    {key:"contact",label:"Clarification contact",pattern:/\b(contact|reach out|questions? (?:to|at)|recruiter|hiring team|email us|write to us|call us|whatsapp)\b|\bemail\s*[:\-]|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i}
  ];
  const numberWords={one:1,a:1,an:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,twelve:12,twentyfour:24};
  function cleanBriefText(value){
    const text=String(value||"").replace(/\u0000/g,"").replace(/\r\n?/g,"\n");
    return text.length>250000?text.slice(0,250000):text;
  }
  function briefSegments(value){
    return cleanBriefText(value).split(/\n+/).flatMap(line=>line.split(/;\s+|(?<=[.!?])\s+(?=[A-Z0-9])/).map(part=>part.trim())).filter(part=>part.length>12);
  }
  function clippedExcerpt(value){
    const text=value.trim();
    return text.length>420?text.slice(0,417)+"…":text;
  }
  function parseDuration(line){
    let match=line.match(/\b(\d+(?:\.\d+)?)\s*(?:(?:-|–|—|to)\s*(\d+(?:\.\d+)?)\s*)?(?:(?:focused|dedicated|of)\s+)?(hours?|hrs?|h)\b/i);
    if(match)return {min:Number(match[1]),max:match[2]?Number(match[2]):null,unit:"hours"};
    match=line.match(/\b(\d+(?:\.\d+)?)\s*[-–]\s*(hours?|hrs?|h)\b/i);
    if(match)return {min:Number(match[1]),max:null,unit:"hours"};
    match=line.match(/\b(\d+(?:\.\d+)?)\s*[-–]?\s*(?:hour|hr)\s+(?:long|task|exercise|assignment|assessment|session)\b/i);
    if(match)return {min:Number(match[1]),max:null,unit:"hours"};
    match=line.match(/\b(\d+(?:\.\d+)?)\s*(?:(?:-|–|—|to)\s*(\d+(?:\.\d+)?)\s*)?(days?|weeks?)\b/i);
    if(match)return {min:Number(match[1]),max:match[2]?Number(match[2]):null,unit:match[3].toLowerCase().startsWith("week")?"weeks":"days"};
    const words="one|two|three|four|five|six|seven|eight|nine|ten|twelve|twentyfour";
    const wordRange=line.match(new RegExp("\\b("+words+")\\s*(?:-|–|—|to)\\s*("+words+")\\s+(hours?|hrs?|days?|weeks?)\\b","i"));
    if(wordRange)return {min:numberWords[wordRange[1].toLowerCase()],max:numberWords[wordRange[2].toLowerCase()],unit:/^h/i.test(wordRange[3])?"hours":/^w/i.test(wordRange[3])?"weeks":"days"};
    const wordHourHyphen=line.match(new RegExp("\\b("+words+")[-–](hours?|hrs?)\\b","i"));
    if(wordHourHyphen)return {min:numberWords[wordHourHyphen[1].toLowerCase()],max:null,unit:"hours"};
    const wordMatch=line.match(new RegExp("\\b("+words+")\\s+(hours?|hrs?|days?|weeks?)\\b","i"));
    if(wordMatch)return {min:numberWords[wordMatch[1].toLowerCase()],max:null,unit:/^h/i.test(wordMatch[2])?"hours":/^w/i.test(wordMatch[2])?"weeks":"days"};
    return null;
  }
  function isWorkEffortLine(line){
    if(/\b(?:per day|a day|each day|daily|per week|a week|each week|weekly|hours?\s*\/\s*day|hours? a day|hours? per day|work shift|office hours|availability)\b/i.test(line))return false;
    if(/\b(submit(?:ted)?|submission|deadline|due date|within|no later than|from receipt|after receiving|after receipt|to return|turnaround)\b/i.test(line))return false;
    return /\b(expected|estimated|time expected|time commitment|focused|dedicated|effort|takes?|take-home|take home|work sample|assignment|case study|assessment|exercise|task|complete|approximately|about|up to|designed to take|timebox|time-box)\b/i.test(line);
  }
  function isSubmissionWindowLine(line){
    if(/\b(feedback|response|reply|decision|hear back|results?|outcome|interview)\b/i.test(line))return false;
    return /\b(submit|deadline|due date|within|no later than|from receipt|after receiving|after receipt|turnaround|submission window|return by|return (?:it|the|your)|to (?:submit|return)|send back)\b/i.test(line);
  }
  function extractBriefTerms(value){
    const segments=briefSegments(value),results=[];
    fieldRules.forEach(rule=>{
      const hits=segments.filter(line=>{
        if(!rule.pattern.test(line))return false;
        if(rule.key==="deliverables"&&/\b(deadline|due date|submit by|submission by|no later than|due by|submit within)\b/i.test(line))return false;
        if(rule.key==="ai_policy"&&/\b(automated|AI evaluation|evaluated by AI|screened by AI)\b/i.test(line)&&! /\b(chatgpt|copilot|claude|cursor|generative ai|ai tools?|language model|llm|ai (?:is )?(?:allowed|permitted|prohibited|banned|not allowed|not permitted|welcome|fine))\b/i.test(line))return false;
        return true;
      }).slice(0,2);
      if(hits.length)results.push({key:rule.key,label:rule.label,kind:"disclosure",excerpt:hits.map(clippedExcerpt).join("\n"),count:hits.length});
    });
    const windowLine=segments.find(line=>isSubmissionWindowLine(line)&&parseDuration(line));
    if(windowLine){
      const duration=parseDuration(windowLine);
      results.push({key:"submission_window_text",label:"Submission window",kind:"window",excerpt:clippedExcerpt(windowLine),amount:duration.max==null?duration.min:null,range:duration.max!=null,unit:duration.unit});
    }
    const effortLine=segments.find(line=>isWorkEffortLine(line)&&parseDuration(line)&&parseDuration(line).unit==="hours");
    if(effortLine){
      const duration=parseDuration(effortLine);
      const nonExact=/\b(up to|at most|no more than|not more than|less than|approximately|about|around|roughly)\b|~/i.test(effortLine);
      results.push({key:"expected_effort_hours",label:"Expected effort",kind:"effort",excerpt:clippedExcerpt(effortLine),hours:duration.max==null&&!nonExact?duration.min:null,range:duration.max!=null||nonExact,approximate:/\b(approximately|about|around|roughly)\b|~/i.test(effortLine),unit:"hours"});
    }
    const vagueEffortLine=segments.find(line=>isWorkEffortLine(line)&&/\b(a few|few|several|half a day|half-day|full day)\b/i.test(line));
    if(vagueEffortLine&&!results.some(p=>p.kind==="effort")){
      results.push({key:"expected_effort_hours",label:"Expected effort",kind:"effort",excerpt:clippedExcerpt(vagueEffortLine),hours:null,range:true,unit:"unknown"});
    }
    const deadlineLine=segments.find(line=>/\b(deadline|due date|submit by|submission by|no later than|due by|return by)\b/i.test(line));
    if(deadlineLine)results.push({key:"deadline_note",label:"Deadline wording (review manually)",kind:"note",excerpt:clippedExcerpt(deadlineLine)});
    return results;
  }
  return {cleanBriefText,briefSegments,extractBriefTerms};
});
