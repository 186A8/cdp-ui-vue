(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-0634"],{"41p1":function(e,t,a){"use strict";var i=a("yIBt");a.n(i).a},lTqN:function(e,t,a){"use strict";a.r(t);var i=a("t3Un");var n=a("xGbm"),r={name:"MpiUpdaterecord",filters:{statusFilter:function(e){switch(e){case 1:return"修改";case 2:return"恢复";case 3:return"合并"}},dateFormatFilter:function(e,t){return Object(n.a)(e,t||"yyyy-MM-dd HH:mm:ss")}},props:{mpiId:{type:String,default:void 0}},data:function(){return{list:null,total:null,listLoading:!0,statusOptions:[1,2,3],sexOptions:[],pageModule:{pageNumber:1,pageSize:10,searchText:"",sortName:"",sortOrder:""},pageSizes:[5,10,25,50,100],form:{},rules:{},dialogFormVisible:!1,dialogStatus:"",textMap:{update:"编辑",create:"创建"}}},mounted:function(){var e=this;this.asyncLoadDictionaryByCode(15,function(t){e.sexOptions=t}),this.asyncOrganizParameterValue("DefaultPageSize","10","表格默认每页记录数",function(t){e.pageModule.pageSize=parseInt(t)}),this.asyncOrganizParameterValue("DefaultPageSizes","5,10,25,50,100","表格默认每页记录数可选择项",function(t){var a=t.split(",");e.pageSizes=[];for(var i=0;i<a.length;i++)e.pageSizes[i]=parseInt(a[i])})},methods:{getList:function(){var e=this;this.listLoading=!0,function(e,t){return Object(i.a)({url:"mpi/v1/updaterecord/list/empId/"+e,method:"post",data:t})}(this.mpiId,this.pageModule).then(function(t){e.list=t.data.rows,e.total=t.data.total,e.listLoading=!1}).catch(function(t){e.$notify({title:"获取列表失败",message:t.message,type:"error",duration:5e3})})},handleSearch:function(){this.pageModule.pageNumber=1,this.getList()},handleSizeChange:function(e){this.pageModule.pageSize=e,this.getList()},handleCurrentChange:function(e){this.pageModule.pageNumber=e,this.getList()},handleAdd:function(){this.resetForm(),this.dialogStatus="create",this.dialogFormVisible=!0},handleEdit:function(){var e=this;this.form&&this.form.id?function(e,t){return Object(i.a)({url:"mpi/v1/updaterecord/"+e,method:t||"post"})}(this.form.id).then(function(t){e.form=t.data,e.dialogFormVisible=!0,e.dialogStatus="update"}).catch(function(t){e.$notify({title:"获取失败",message:t.message,type:"error",duration:5e3})}):this.$message({message:"操作前请先选择一条数据!"})},handleDelete:function(){var e=this;this.form&&this.form.id?this.$confirm("此操作将永久删除相关数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){(function(e){return Object(i.a)({url:"mpi/v1/updaterecord/"+e,method:"delete"})})(e.form.id).then(function(t){e.dialogFormVisible=!1,e.getList(),e.$notify({title:"成功",message:"删除成功!",type:"success",duration:2e3})}).catch(function(t){e.$notify({title:"删除失败",message:t.message,type:"error",duration:5e3})})}).catch(function(e){}):this.$message({message:"操作前请先选择一条数据!"})},create:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;(function(e){return Object(i.a)({url:"mpi/v1/updaterecord",method:"post",data:e})})(t.form).then(function(){t.dialogFormVisible=!1,t.getList(),t.$notify({title:"成功",message:"创建成功",type:"success",duration:2e3})}).catch(function(e){t.$notify({title:"新建失败",message:e.message,type:"error",duration:5e3})})})},cancel:function(e){this.dialogFormVisible=!1,"form"===e&&this.$refs.form.resetFields()},update:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;t.dialogFormVisible=!1,function(e){return Object(i.a)({url:"mpi/v1/updaterecord",method:"put",data:e})}(t.form).then(function(){t.dialogFormVisible=!1,t.getList(),t.$notify({title:"成功",message:"修改成功",type:"success",duration:2e3})}).catch(function(e){t.$notify({title:"更新信息失败",message:e.message,type:"error",duration:5e3})})})},resetForm:function(){this.form={mpiId:this.mpiId}},sortChange:function(e){this.pageModule.sortOrder=e.order&&"descending"===e.order?"DESC":"ASC",this.pageModule.sortName=e.prop,this.pageModule.sortName&&this.getList()},rowClick:function(e,t,a){this.form=e}}},s=(a("41p1"),a("KHd+")),o=Object(s.a)(r,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container calendar-list-container"},[a("div",{staticClass:"filter-container"},[a("el-button",{directives:[{name:"waves",rawName:"v-waves"},{name:"permission",rawName:"v-permission",value:"1",expression:"'1'"}],staticClass:"filter-item",staticStyle:{"margin-left":"5px"},attrs:{round:"",type:"primary",icon:"el-icon-circle-plus",size:"mini"},on:{click:e.getList}},[e._v(e._s(e.$t("table.refresh")))])],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],staticStyle:{width:"100%"},attrs:{data:e.list,"default-sort":{prop:"modifyTime",order:"descending"},"element-loading-text":"努力加载中",border:"",fit:"","highlight-current-row":"",size:"mini"},on:{"sort-change":e.sortChange,"row-click":e.rowClick}},[a("el-table-column",{attrs:{align:"center",label:"姓名",sortable:"",prop:"name"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"身份证",sortable:"",prop:"idcard"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"出生日期",sortable:"",prop:"birthday"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("dateFormatFilter")(t.row.birthday,"yyyy-MM-dd")))])]}}])}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"性别",sortable:"",prop:"sex"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.getDicNameValue(e.sexOptions,t.row.sex)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"就诊卡号",sortable:"",prop:"cardno"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"操作类型",sortable:"",prop:"type"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("dateFormatFilter")(t.row.type,t.row.type)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"修改时间",sortable:"",prop:"modifyTime"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"修改人",sortable:"",prop:"modifier"}})],1),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:!e.listLoading,expression:"!listLoading"}],staticClass:"pagination-container"},[a("el-pagination",{attrs:{"current-page":e.pageModule.pageNumber,"page-sizes":e.pageSizes,"page-size":e.pageModule.pageSize,total:e.total,layout:"total, sizes, prev, pager, next, jumper"},on:{"update:currentPage":function(t){e.$set(e.pageModule,"pageNumber",t)},"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1)},[],!1,null,"8d8dddce",null);o.options.__file="index.vue";t.default=o.exports},xGbm:function(e,t,a){"use strict";function i(e,t){if(!e||""===e)return e;if("string"==typeof e&&(e=new Date(e)),!(e instanceof Date))return e;/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(e.getFullYear()+"").substr(4-RegExp.$1.length)));var a={"M+":e.getMonth()+1,"d+":e.getDate(),"H+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds()};for(var i in a)if(new RegExp("("+i+")").test(t)){var r=a[i]+"";t=t.replace(RegExp.$1,1===RegExp.$1.length?r:n(r))}return t}function n(e){return("00"+e).substr(e.length)}a.d(t,"a",function(){return i})},yIBt:function(e,t,a){}}]);