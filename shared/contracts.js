/** @typedef {{id:string,name:string,rating:number|null,stock:number|null,licensed:boolean|null,category:string,previous:Object,current:Object,concern:string|null,participations:number,dataVersion:string,windows:Object,benchmark:Object}} Merchant
 * @typedef {{status:'eligible'|'ineligible'|'unknown',reasons:Array<{id:string,pass:boolean|null,detail:string}>,priority:string}} Eligibility
 * @typedef {{id:string,merchantId:string,version:string,revision:number,text:string,approvedText:string|null,mode:string}} OutreachDraft
 * @typedef {{id:string,key:string,merchantId:string,version:string,text:string,createdAt:string,receipts:Array<{type:string,at:string}>}} Task
 */
export const labels={eligible:'符合条件',ineligible:'不符合',unknown:'待补信息'};
export const receiptLabels={sent:'模拟已发送',delivered:'模拟已送达',replied:'模拟已回复',enrolled:'模拟已报名',failed:'模拟发送失败'};
export class ActionError extends Error {constructor(message){super(message);this.name='ActionError';}}
