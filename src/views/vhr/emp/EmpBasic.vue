<template>
  <div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-input
            v-model="keywords"
            placeholder="通过员工名搜索员工,记得回车哦..."
            clearable
            style="width: 300px;margin: 0px;padding: 0px;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            prefix-icon="el-icon-search"
            @change="keywordsChange"
            @keyup.enter.native="searchEmp"
          />
          <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchEmp">
            搜索
          </el-button>
          <el-button
            slot="reference"
            type="primary"
            size="mini"
            style="margin-left: 5px"
            @click="showAdvanceSearchView"
          >
            <i
              class="fa fa-lg"
              :class="[advanceSearchViewVisible ? faangledoubleup:faangledoubledown]"
              style="margin-right: 5px"
            />高级搜索
          </el-button>
        </div>
        <div style="margin-left: 5px;margin-right: 20px;display: inline">
          <el-upload
            :show-file-list="false"
            accept="application/vnd.ms-excel"
            action="/employee/basic/importEmp"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError"
            :disabled="fileUploadBtnText==='正在导入'"
            :before-upload="beforeFileUpload"
            style="display: inline"
          >
            <el-button size="mini" type="success" :loading="fileUploadBtnText==='正在导入'">
              <i
                class="fa fa-lg fa-level-up"
                style="margin-right: 5px"
              />{{ fileUploadBtnText }}
            </el-button>
          </el-upload>
          <el-button type="success" size="mini" @click="exportEmps">
            <i
              class="fa fa-lg fa-level-down"
              style="margin-right: 5px"
            />导出数据
          </el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="showAddEmpView"
          >
            添加员工
          </el-button>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <transition name="slide-fade">
            <div
              v-show="advanceSearchViewVisible"
              style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff"
            >
              <el-row>
                <el-col :span="5">
                  政治面貌:
                  <el-select v-model="emp.politicId" style="width: 130px" size="mini" placeholder="政治面貌">
                    <el-option
                      v-for="item in politics"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-col>
                <el-col :span="4">
                  民族:
                  <el-select v-model="emp.nationId" style="width: 130px" size="mini" placeholder="请选择民族">
                    <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-col>
                <el-col :span="4">
                  职位:
                  <el-select v-model="emp.posId" style="width: 130px" size="mini" placeholder="请选择职位">
                    <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-col>
                <el-col :span="4">
                  职称:
                  <el-select v-model="emp.jobLevelId" style="width: 130px" size="mini" placeholder="请选择职称">
                    <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-col>
                <el-col :span="7">
                  聘用形式:
                  <el-radio-group v-model="emp.engageForm">
                    <el-radio label="劳动合同">
                      劳动合同
                    </el-radio>
                    <el-radio style="margin-left: 15px" label="劳务合同">
                      劳务合同
                    </el-radio>
                  </el-radio-group>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="5">
                  所属部门:
                  <el-popover
                    v-model="showOrHidePop2"
                    placement="right"
                    title="请选择部门"
                    trigger="manual"
                  >
                    <el-tree
                      :data="deps"
                      :default-expand-all="true"
                      :props="defaultProps"
                      :expand-on-click-node="false"
                      @node-click="handleNodeClick2"
                    />
                    <div
                      slot="reference"
                      style="width: 130px;height: 26px;display: inline-flex;font-size:13px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
                      :style="{color: depTextColor}"
                      @click="showDepTree2"
                    >
                      {{ emp.departmentName }}
                    </div>
                  </el-popover>
                </el-col>
                <el-col :span="10">
                  入职日期:
                  <el-date-picker
                    v-model="beginDateScope"
                    unlink-panels
                    size="mini"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-col>
                <el-col :span="5" :offset="4">
                  <el-button size="mini" @click="cancelSearch">
                    取消
                  </el-button>
                  <el-button icon="el-icon-search" type="primary" size="mini" @click="searchEmp">
                    搜索
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </transition>
          <el-table
            v-loading="tableLoading"
            :data="emps"
            border
            stripe
            size="mini"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              align="left"
              width="30"
            />
            <el-table-column
              prop="name"
              align="left"
              fixed
              label="姓名"
              width="90"
            />
            <el-table-column
              prop="workID"
              width="85"
              align="left"
              label="工号"
            />
            <el-table-column
              prop="gender"
              label="性别"
              width="50"
            />
            <el-table-column
              width="85"
              align="left"
              label="出生日期"
            >
              <template slot-scope="scope">
                {{ scope.row.birthday | formatDate }}
              </template>
            </el-table-column>
            <el-table-column
              prop="idCard"
              width="150"
              align="left"
              label="身份证号码"
            />
            <el-table-column
              prop="wedlock"
              width="70"
              label="婚姻状况"
            />
            <el-table-column
              width="50"
              prop="nation.name"
              label="民族"
            />
            <el-table-column
              prop="nativePlace"
              width="80"
              label="籍贯"
            />
            <el-table-column
              prop="politicsStatus.name"
              label="政治面貌"
            />
            <el-table-column
              prop="email"
              width="180"
              align="left"
              label="电子邮件"
            />
            <el-table-column
              prop="phone"
              width="100"
              label="电话号码"
            />
            <el-table-column
              prop="address"
              width="220"
              align="left"
              label="联系地址"
            />
            <el-table-column
              prop="department.name"
              align="left"
              width="100"
              label="所属部门"
            />
            <el-table-column
              width="100"
              align="left"
              prop="position.name"
              label="职位"
            />
            <el-table-column
              prop="jobLevel.name"
              width="100"
              align="left"
              label="职称"
            />
            <el-table-column
              prop="engageForm"
              label="聘用形式"
            />
            <el-table-column
              width="85"
              align="left"
              label="入职日期"
            >
              <template slot-scope="scope">
                {{ scope.row.beginDate | formatDate }}
              </template>
            </el-table-column>
            <el-table-column
              width="85"
              align="left"
              label="转正日期"
            >
              <template slot-scope="scope">
                {{ scope.row.conversionTime | formatDate }}
              </template>
            </el-table-column>
            <el-table-column
              width="95"
              align="left"
              label="合同起始日期"
            >
              <template slot-scope="scope">
                {{ scope.row.beginContract | formatDate }}
              </template>
            </el-table-column>
            <el-table-column
              width="95"
              align="left"
              label="合同截至日期"
            >
              <template slot-scope="scope">
                {{ scope.row.endContract | formatDate }}
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              width="70"
              label="合同期限"
            >
              <template slot-scope="scope">
                {{ scope.row.contractTerm }}年
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              prop="tiptopDegree"
              label="最高学历"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="195"
            >
              <template slot-scope="scope">
                <el-button
                  style="padding: 3px 4px 3px 4px;margin: 2px"
                  size="mini"
                  @click="showEditEmpView(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  style="padding: 3px 4px 3px 4px;margin: 2px"
                  type="primary"
                  size="mini"
                >
                  查看高级资料
                </el-button>
                <el-button
                  type="danger"
                  style="padding: 3px 4px 3px 4px;margin: 2px"
                  size="mini"
                  @click="deleteEmp(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-button
              v-if="emps.length>0"
              type="danger"
              size="mini"
              :disabled="multipleSelection.length===0"
              @click="deleteManyEmps"
            >
              批量删除
            </el-button>
            <el-pagination
              background
              :page-size="10"
              :current-page="currentPage"
              layout="prev, pager, next"
              :total="totalCount"
              @current-change="currentChange"
            />
          </div>
        </div>
      </el-main>
    </el-container>
    <el-form ref="addEmpForm" :model="emp" :rules="rules" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="77%"
        >
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="姓名:" prop="name">
                  <el-input
                    v-model="emp.name"
                    prefix-icon="el-icon-edit"
                    size="mini"
                    style="width: 150px"
                    placeholder="请输入员工姓名"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="性别:" prop="gender">
                  <el-radio-group v-model="emp.gender">
                    <el-radio label="男">
                      男
                    </el-radio>
                    <el-radio style="margin-left: 15px" label="女">
                      女
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="出生日期:" prop="birthday">
                  <el-date-picker
                    v-model="emp.birthday"
                    size="mini"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 150px"
                    type="date"
                    placeholder="出生日期"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="政治面貌:" prop="politicId">
                  <el-select v-model="emp.politicId" style="width: 200px" size="mini" placeholder="政治面貌">
                    <el-option
                      v-for="item in politics"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="民族:" prop="nationId">
                  <el-select v-model="emp.nationId" style="width: 150px" size="mini" placeholder="请选择民族">
                    <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="籍贯:" prop="nativePlace">
                  <el-input v-model="emp.nativePlace" size="mini" style="width: 120px" placeholder="员工籍贯" />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="电子邮箱:" prop="email">
                  <el-input
                    v-model="emp.email"
                    prefix-icon="el-icon-message"
                    size="mini"
                    style="width: 150px"
                    placeholder="电子邮箱地址..."
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="联系地址:" prop="address">
                  <el-input
                    v-model="emp.address"
                    prefix-icon="el-icon-edit"
                    size="mini"
                    style="width: 200px"
                    placeholder="联系地址..."
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="职位:" prop="posId">
                  <el-select v-model="emp.posId" style="width: 150px" size="mini" placeholder="请选择职位">
                    <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="职称:" prop="jobLevelId">
                  <el-select v-model="emp.jobLevelId" style="width: 120px" size="mini" placeholder="请选择职称">
                    <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="所属部门:" prop="departmentId">
                  <el-popover
                    v-model="showOrHidePop"
                    placement="right"
                    title="请选择部门"
                    trigger="manual"
                  >
                    <el-tree
                      :data="deps"
                      :default-expand-all="true"
                      :props="defaultProps"
                      :expand-on-click-node="false"
                      @node-click="handleNodeClick"
                    />
                    <div
                      slot="reference"
                      style="width: 150px;height: 26px;display: inline-flex;font-size:13px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
                      :style="{color: depTextColor}"
                      @click.left="showDepTree"
                    >
                      {{ emp.departmentName }}
                    </div>
                  </el-popover>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="电话号码:" prop="phone">
                  <el-input
                    v-model="emp.phone"
                    prefix-icon="el-icon-phone"
                    size="mini"
                    style="width: 200px"
                    placeholder="电话号码..."
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="工号:" prop="workID">
                  <el-input
                    v-model="emp.workID"
                    disabled
                    size="mini"
                    style="width: 150px"
                    placeholder="员工工号..."
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="学历:" prop="tiptopDegree">
                  <el-select v-model="emp.tiptopDegree" style="width: 120px" size="mini" placeholder="最高学历">
                    <el-option
                      v-for="item in degrees"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="毕业院校:" prop="school">
                  <el-input
                    v-model="emp.school"
                    prefix-icon="el-icon-edit"
                    size="mini"
                    style="width: 150px"
                    placeholder="毕业院校名称"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="专业名称:" prop="specialty">
                  <el-input
                    v-model="emp.specialty"
                    prefix-icon="el-icon-edit"
                    size="mini"
                    style="width: 200px"
                    placeholder="专业名称"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="入职日期:" prop="beginDate">
                  <el-date-picker
                    v-model="emp.beginDate"
                    size="mini"
                    style="width: 130px"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="入职日期"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="转正日期:" prop="conversionTime">
                  <el-date-picker
                    v-model="emp.conversionTime"
                    size="mini"
                    style="width: 130px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="date"
                    placeholder="转正日期"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="合同起始日期:" prop="beginContract">
                  <el-date-picker
                    v-model="emp.beginContract"
                    size="mini"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 135px"
                    type="date"
                    placeholder="合同起始日期"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="合同终止日期:" prop="endContract">
                  <el-date-picker
                    v-model="emp.endContract"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    size="mini"
                    style="width: 135px"
                    type="date"
                    placeholder="合同终止日期"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>
                <el-form-item label="身份证号码:" prop="idCard">
                  <el-input
                    v-model="emp.idCard"
                    prefix-icon="el-icon-edit"
                    size="mini"
                    style="width: 180px"
                    placeholder="请输入员工身份证号码..."
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item label="聘用形式:" prop="engageForm">
                  <el-radio-group v-model="emp.engageForm">
                    <el-radio label="劳动合同">
                      劳动合同
                    </el-radio>
                    <el-radio style="margin-left: 15px" label="劳务合同">
                      劳务合同
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item label="婚姻状况:" prop="wedlock">
                  <el-radio-group v-model="emp.wedlock">
                    <el-radio label="已婚">
                      已婚
                    </el-radio>
                    <el-radio style="margin-left: 15px" label="未婚">
                      未婚
                    </el-radio>
                    <el-radio style="margin-left: 15px" label="离异">
                      离异
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="addEmp('addEmpForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      emps: [],
      keywords: '',
      fileUploadBtnText: '导入数据',
      beginDateScope: '',
      faangledoubleup: 'fa-angle-double-up',
      faangledoubledown: 'fa-angle-double-down',
      dialogTitle: '',
      multipleSelection: [],
      depTextColor: '#c0c4cc',
      nations: [],
      politics: [],
      positions: [],
      joblevels: [],
      totalCount: -1,
      currentPage: 1,
      degrees: [],
      deps: [],
      defaultProps: {
        label: 'name',
        isLeaf: 'leaf',
        children: 'children'
      },
      dialogVisible: false,
      tableLoading: false,
      advanceSearchViewVisible: false,
      showOrHidePop: false,
      showOrHidePop2: false,
      wedlocks: [],
      emp: {
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: '',
        nativePlace: '',
        politicId: '',
        email: '',
        phone: '',
        address: '',
        departmentId: '',
        departmentName: '所属部门...',
        jobLevelId: '',
        posId: '',
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '',
        workID: '',
        contractTerm: '',
        conversionTime: '',
        notWorkDate: '',
        beginContract: '',
        endContract: '',
        workAge: ''
      },
      rules: {
        name: [{ required: true, message: '必填:姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '必填:性别', trigger: 'blur' }],
        birthday: [{ required: true, message: '必填:出生日期', trigger: 'blur' }],
        idCard: [{
          required: true,
          message: '必填:身份证号码',
          trigger: 'blur'
        }, {
          pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
          message: '身份证号码格式不正确',
          trigger: 'blur'
        }],
        wedlock: [{ required: true, message: '必填:婚姻状况', trigger: 'blur' }],
        nationId: [{ required: true, message: '必填:民族', trigger: 'change' }],
        nativePlace: [{ required: true, message: '必填:籍贯', trigger: 'blur' }],
        politicId: [{ required: true, message: '必填:政治面貌', trigger: 'blur' }],
        email: [{ required: true, message: '必填:电子邮箱', trigger: 'blur' }, {
          type: 'email',
          message: '邮箱格式不正确',
          trigger: 'blur'
        }],
        phone: [{ required: true, message: '必填:电话号码', trigger: 'blur' }],
        address: [{ required: true, message: '必填:联系地址', trigger: 'blur' }],
        departmentId: [{ required: true, message: '必填:部门', trigger: 'change' }],
        jobLevelId: [{ required: true, message: '必填:职称', trigger: 'change' }],
        posId: [{ required: true, message: '必填:职位', trigger: 'change' }],
        engageForm: [{ required: true, message: '必填:聘用形式', trigger: 'blur' }],
        tiptopDegree: [{ required: true, message: '必填:最高学历', trigger: 'change' }],
        specialty: [{ required: true, message: '必填:专业', trigger: 'blur' }],
        workID: [{ required: true, message: '必填:工号', trigger: 'blur' }],
        school: [{ required: true, message: '必填:毕业院校', trigger: 'blur' }],
        beginDate: [{ required: true, message: '必填:入职日期', trigger: 'blur' }],
        conversionTime: [{ required: true, message: '必填:转正日期', trigger: 'blur' }],
        beginContract: [{ required: true, message: '必填:合同起始日期', trigger: 'blur' }],
        endContract: [{ required: true, message: '必填:合同终止日期', trigger: 'blur' }],
        workAge: [{ required: true, message: '必填:工龄', trigger: 'blur' }]
      }
    }
  },
  mounted: function() {
    this.loadDictionaryById(5).then(res => {
      this.wedlocks = res.details
    })
    this.loadDictionaryById(6).then(res => {
      this.nations = res.details
    })
    this.loadDictionaryById(42).then(res => {
      this.politics = res.details
    })
    this.loadDictionaryById(141).then(res => {
      this.positions = res.details
    })
    this.loadDictionaryById(140).then(res => {
      this.joblevels = res.details
    })
    this.loadDictionaryById(47).then(res => {
      this.degrees = res.details
    })
    this.initData()
    this.loadEmps()
  },
  methods: {
    fileUploadSuccess(response, file, fileList) {
      if (response) {
        this.$message({ type: response.status, message: response.msg })
      }
      this.loadEmps()
      this.fileUploadBtnText = '导入数据'
    },
    fileUploadError() {
      this.$message({ type: 'error', message: '导入失败!' })
      this.fileUploadBtnText = '导入数据'
    },
    beforeFileUpload(file) {
      this.fileUploadBtnText = '正在导入'
    },
    exportEmps() {
      window.open('gateway/vhr/employee/basic/exportEmp', '_parent')
    },
    cancelSearch() {
      this.advanceSearchViewVisible = false
      this.emptyEmpData()
      this.beginDateScope = ''
      this.loadEmps()
    },
    showAdvanceSearchView() {
      this.advanceSearchViewVisible = !this.advanceSearchViewVisible
      this.keywords = ''
      if (!this.advanceSearchViewVisible) {
        this.emptyEmpData()
        this.beginDateScope = ''
        this.loadEmps()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteManyEmps() {
      this.$confirm('此操作将删除[' + this.multipleSelection.length + ']条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = ''
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids += this.multipleSelection[i].id + ','
        }
        this.doDelete(ids)
      }).catch(reason => {
        this.$notify({
          title: '删除员工信息失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    deleteEmp(row) {
      this.$confirm('此操作将永久删除[' + row.name + '], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelete(row.id)
      }).catch(reason => {
        this.$notify({
          title: '删除员工信息失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    doDelete(ids) {
      this.tableLoading = true
      this.deleteRequest('gateway/vhr/employee/basic/emp/' + ids).then(resp => {
        this.tableLoading = false
        if (resp && resp.status === 200) {
          this.loadEmps()
        }
      }).catch(reason => {
        this.$notify({
          title: '获取员工最大工作ID失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    keywordsChange(val) {
      if (val === '') {
        this.loadEmps()
      }
    },
    searchEmp() {
      this.loadEmps()
    },
    currentChange(currentChange) {
      this.currentPage = currentChange
      this.loadEmps()
    },
    loadEmps() {
      this.tableLoading = true
      this.getRequest('gateway/vhr/employee/basic/emp?page=' + this.currentPage + '&size=10&keywords=' + this.keywords + '&politicId=' + this.emp.politicId + '&nationId=' + this.emp.nationId + '&posId=' + this.emp.posId + '&jobLevelId=' + this.emp.jobLevelId + '&engageForm=' + this.emp.engageForm + '&departmentId=' + this.emp.departmentId + '&beginDateScope=' + this.beginDateScope).then(resp => {
        this.tableLoading = false
        if (resp && resp.status === 200) {
          const data = resp.data
          this.emps = data.emps
          this.totalCount = data.count
          //            this.emptyEmpData();
        }
      }).catch(reason => {
        this.$notify({
          title: '获取员工信息失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    addEmp(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.emp.id) {
            // 更新
            this.tableLoading = true
            this.putRequest('gateway/vhr/employee/basic/emp', this.emp).then(resp => {
              this.tableLoading = false
              if (resp && resp.status === 200) {
                this.dialogVisible = false
                this.emptyEmpData()
                this.loadEmps()
              }
            }).catch(reason => {
              this.$notify({
                title: '更新员工信息失败',
                message: reason.message,
                type: 'error',
                duration: 5000
              })
            })
          } else {
            // 添加
            this.tableLoading = true
            this.postRequest('gateway/vhr/employee/basic/emp', this.emp).then(resp => {
              this.tableLoading = false
              if (resp && resp.status === 200) {
                this.dialogVisible = false
                this.emptyEmpData()
                this.loadEmps()
              }
            }).catch(reason => {
              this.$notify({
                title: '获取员工信息失败',
                message: reason.message,
                type: 'error',
                duration: 5000
              })
            })
          }
        } else {
          return false
        }
      })
    },
    cancelEidt() {
      this.dialogVisible = false
      this.emptyEmpData()
    },
    showDepTree() {
      this.showOrHidePop = !this.showOrHidePop
    },
    showDepTree2() {
      this.showOrHidePop2 = !this.showOrHidePop2
    },
    handleNodeClick(data) {
      this.emp.departmentName = data.name
      this.emp.departmentId = data.id
      this.showOrHidePop = false
      this.depTextColor = '#606266'
    },
    handleNodeClick2(data) {
      this.emp.departmentName = data.name
      this.emp.departmentId = data.id
      this.showOrHidePop2 = false
      this.depTextColor = '#606266'
    },
    initData() {
      this.getRequest('gateway/vhr/employee/basic/basicdata').then(resp => {
        if (resp && resp.status === 200) {
          const data = resp.data
          this.nations = data.nations
          this.politics = data.politics
          this.deps = data.deps
          this.positions = data.positions
          this.joblevels = data.joblevels
          this.emp.workID = data.workID
        }
      }).catch(reason => {
        this.$notify({
          title: '获取员工基础信息失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    showEditEmpView(row) {
      console.log(row)
      this.dialogTitle = '编辑员工'
      this.emp = row
      this.emp.birthday = this.formatDate(row.birthday)
      this.emp.conversionTime = this.formatDate(row.conversionTime)
      this.emp.beginContract = this.formatDate(row.beginContract)
      this.emp.endContract = this.formatDate(row.endContract)
      this.emp.beginDate = this.formatDate(row.beginDate)
      this.emp.nationId = row.nation.id
      this.emp.politicId = row.politicsStatus.id
      this.emp.departmentId = row.department.id
      this.emp.departmentName = row.department.name
      this.emp.jobLevelId = row.jobLevel.id
      this.emp.posId = row.position.id
      //        delete this.emp.department;
      //        delete this.emp.jobLevel;
      //        delete this.emp.position;
      //        delete this.emp.nation;
      //        delete this.emp.politicsStatus;
      delete this.emp.salary
      delete this.emp.workAge
      delete this.emp.notWorkDate
      this.dialogVisible = true
      console.log(this.emp)
    },
    showAddEmpView() {
      this.dialogTitle = '添加员工'
      this.dialogVisible = true
      this.getRequest('gateway/vhr/employee/basic/maxWorkID').then(resp => {
        if (resp && resp.status === 200) {
          this.emp.workID = resp.data
        }
      }).catch(reason => {
        this.$notify({
          title: '获取员工最大工作ID失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    emptyEmpData() {
      this.emp = {
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: '',
        nativePlace: '',
        politicId: '',
        email: '',
        phone: '',
        address: '',
        departmentId: '',
        departmentName: '所属部门...',
        jobLevelId: '',
        posId: '',
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '',
        workID: '',
        contractTerm: '',
        conversionTime: '',
        notWorkDate: '',
        beginContract: '',
        endContract: '',
        workAge: ''
      }
    }
  }
}
</script>
<style>
  .el-dialog__body {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .slide-fade-enter-active {
    transition: all .8s ease;
  }

  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
