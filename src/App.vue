<template>
  <div v-if="!isLoggedIn" class="login-container">
    <div class="login-form">
      <h2>广东省低空飞行服务统一门户</h2>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loginLoading">登录</el-button>
          <el-button @click="handleYuexinqianLogin" style="margin-left: 10px;">粤信签登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  
  <div v-else class="main-container">
    <el-container>
      <el-header height="60px">
        <div class="header-left">
          <h1 style="margin: 0; font-size: 20px;">广东省低空飞行服务统一门户</h1>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userInfo.username }} <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical-demo"
            @select="handleMenuSelect"
            background-color="#303133"
            text-color="#fff"
            active-text-color="#409EFF"
          >
            <el-menu-item index="dashboard">
              <el-icon><Home /></el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="qualification">
              <el-icon><Document /></el-icon>
              <span>资质管理</span>
            </el-menu-item>
            <el-menu-item index="flight">
              <el-icon><Plane /></el-icon>
              <span>飞行业务</span>
            </el-menu-item>
            <el-menu-item index="diversion">
              <el-icon><Map /></el-icon>
              <span>起飞点改航</span>
            </el-menu-item>
            <el-menu-item index="progress">
              <el-icon><Timer /></el-icon>
              <span>进度中心</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 首页 -->
          <div v-if="activeMenu === 'dashboard'">
            <h2>欢迎使用广东省低空飞行服务统一门户</h2>
            <p style="margin: 20px 0;">这里是您处理飞行相关业务的综合平台</p>
            
            <div class="card-container">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>资质管理</span>
                  </div>
                </template>
                <div class="card-content">
                  <p>管理您的飞行资质，包括飞行员执照、无人机注册等</p>
                  <el-button type="primary" @click="handleMenuSelect('qualification')" style="margin-top: 20px;">进入管理</el-button>
                </div>
              </el-card>
              
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>飞行业务</span>
                  </div>
                </template>
                <div class="card-content">
                  <p>处理无人机和通用航空的飞行申请、计划等业务</p>
                  <el-button type="primary" @click="handleMenuSelect('flight')" style="margin-top: 20px;">进入处理</el-button>
                </div>
              </el-card>
              
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>起飞点改航</span>
                  </div>
                </template>
                <div class="card-content">
                  <p>在地图上选择新的起飞点，提交改航申请</p>
                  <el-button type="primary" @click="handleMenuSelect('diversion')" style="margin-top: 20px;">进入改航</el-button>
                </div>
              </el-card>
              
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>进度中心</span>
                  </div>
                </template>
                <div class="card-content">
                  <p>查看所有业务的处理进度和状态</p>
                  <el-button type="primary" @click="handleMenuSelect('progress')" style="margin-top: 20px;">查看进度</el-button>
                </div>
              </el-card>
            </div>
            
            <div class="timeline-container">
              <h3>最新通知</h3>
              <el-timeline>
                <el-timeline-item
                  v-for="(item, index) in notifications"
                  :key="index"
                  :timestamp="item.time"
                  placement="top"
                >
                  <el-card shadow="hover">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.content }}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
          
          <!-- 资质管理 -->
          <div v-if="activeMenu === 'qualification'">
            <h2>资质管理</h2>
            <div class="form-container">
              <el-tabs v-model="activeQualificationTab">
                <el-tab-pane label="飞行员执照" name="pilot">
                  <el-form :model="qualificationForm.pilot" :rules="qualificationRules.pilot" ref="pilotFormRef" label-width="120px">
                    <el-form-item label="执照类型" prop="type">
                      <el-select v-model="qualificationForm.pilot.type" placeholder="请选择执照类型">
                        <el-option label="私用驾驶员执照" value="private"></el-option>
                        <el-option label="商用驾驶员执照" value="commercial"></el-option>
                        <el-option label="航线运输驾驶员执照" value="airline"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="执照号码" prop="number">
                      <el-input v-model="qualificationForm.pilot.number" placeholder="请输入执照号码"></el-input>
                    </el-form-item>
                    <el-form-item label="有效期至" prop="expiry">
                      <el-date-picker v-model="qualificationForm.pilot.expiry" type="date" placeholder="请选择有效期至"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="上传执照" prop="file">
                      <el-upload
                        class="upload-demo"
                        action="#"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="qualificationForm.pilot.fileList"
                        :auto-upload="false"
                      >
                        <el-button type="primary"><el-icon><Upload /></el-icon> 点击上传</el-button>
                        <template #tip>
                          <div class="el-upload__tip">
                            只能上传jpg/png文件，且不超过2MB
                          </div>
                        </template>
                      </el-upload>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="handleSubmit('pilot')">提交</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                
                <el-tab-pane label="无人机注册" name="drone">
                  <el-form :model="qualificationForm.drone" :rules="qualificationRules.drone" ref="droneFormRef" label-width="120px">
                    <el-form-item label="无人机型号" prop="model">
                      <el-input v-model="qualificationForm.drone.model" placeholder="请输入无人机型号"></el-input>
                    </el-form-item>
                    <el-form-item label="注册号码" prop="number">
                      <el-input v-model="qualificationForm.drone.number" placeholder="请输入注册号码"></el-input>
                    </el-form-item>
                    <el-form-item label="重量" prop="weight">
                      <el-input v-model="qualificationForm.drone.weight" type="number" placeholder="请输入重量（kg）"></el-input>
                    </el-form-item>
                    <el-form-item label="上传注册证" prop="file">
                      <el-upload
                        class="upload-demo"
                        action="#"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="qualificationForm.drone.fileList"
                        :auto-upload="false"
                      >
                        <el-button type="primary"><el-icon><Upload /></el-icon> 点击上传</el-button>
                        <template #tip>
                          <div class="el-upload__tip">
                            只能上传jpg/png文件，且不超过2MB
                          </div>
                        </template>
                      </el-upload>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="handleSubmit('drone')">提交</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                
                <el-tab-pane label="空域使用证" name="airspace">
                  <el-form :model="qualificationForm.airspace" :rules="qualificationRules.airspace" ref="airspaceFormRef" label-width="120px">
                    <el-form-item label="空域名称" prop="name">
                      <el-input v-model="qualificationForm.airspace.name" placeholder="请输入空域名称"></el-input>
                    </el-form-item>
                    <el-form-item label="使用范围" prop="range">
                      <el-input v-model="qualificationForm.airspace.range" placeholder="请输入使用范围"></el-input>
                    </el-form-item>
                    <el-form-item label="有效期至" prop="expiry">
                      <el-date-picker v-model="qualificationForm.airspace.expiry" type="date" placeholder="请选择有效期至"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="上传证件" prop="file">
                      <el-upload
                        class="upload-demo"
                        action="#"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="qualificationForm.airspace.fileList"
                        :auto-upload="false"
                      >
                        <el-button type="primary"><el-icon><Upload /></el-icon> 点击上传</el-button>
                        <template #tip>
                          <div class="el-upload__tip">
                            只能上传jpg/png文件，且不超过2MB
                          </div>
                        </template>
                      </el-upload>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="handleSubmit('airspace')">提交</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                
                <el-tab-pane label="飞行计划审批" name="flightPlan">
                  <el-form :model="qualificationForm.flightPlan" :rules="qualificationRules.flightPlan" ref="flightPlanFormRef" label-width="120px">
                    <el-form-item label="计划编号" prop="number">
                      <el-input v-model="qualificationForm.flightPlan.number" placeholder="请输入计划编号"></el-input>
                    </el-form-item>
                    <el-form-item label="飞行区域" prop="area">
                      <el-input v-model="qualificationForm.flightPlan.area" placeholder="请输入飞行区域"></el-input>
                    </el-form-item>
                    <el-form-item label="飞行时间" prop="time">
                      <el-date-picker v-model="qualificationForm.flightPlan.time" type="datetime" placeholder="请选择飞行时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="上传审批" prop="file">
                      <el-upload
                        class="upload-demo"
                        action="#"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="qualificationForm.flightPlan.fileList"
                        :auto-upload="false"
                      >
                        <el-button type="primary"><el-icon><Upload /></el-icon> 点击上传</el-button>
                        <template #tip>
                          <div class="el-upload__tip">
                            只能上传jpg/png文件，且不超过2MB
                          </div>
                        </template>
                      </el-upload>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="handleSubmit('flightPlan')">提交</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                
                <el-tab-pane label="地面站许可证" name="groundStation">
                  <el-form :model="qualificationForm.groundStation" :rules="qualificationRules.groundStation" ref="groundStationFormRef" label-width="120px">
                    <el-form-item label="站点名称" prop="name">
                      <el-input v-model="qualificationForm.groundStation.name" placeholder="请输入站点名称"></el-input>
                    </el-form-item>
                    <el-form-item label="站点地址" prop="address">
                      <el-input v-model="qualificationForm.groundStation.address" placeholder="请输入站点地址"></el-input>
                    </el-form-item>
                    <el-form-item label="有效期至" prop="expiry">
                      <el-date-picker v-model="qualificationForm.groundStation.expiry" type="date" placeholder="请选择有效期至"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="上传许可证" prop="file">
                      <el-upload
                        class="upload-demo"
                        action="#"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="qualificationForm.groundStation.fileList"
                        :auto-upload="false"
                      >
                        <el-button type="primary"><el-icon><Upload /></el-icon> 点击上传</el-button>
                        <template #tip>
                          <div class="el-upload__tip">
                            只能上传jpg/png文件，且不超过2MB
                          </div>
                        </template>
                      </el-upload>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="handleSubmit('groundStation')">提交</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                
                <el-tab-pane label="通信频率许可" name="frequency">
                  <el-form :model="qualificationForm.frequency" :rules="qualificationRules.frequency" ref="frequencyFormRef" label-width="120px">
                    <el-form-item label="频率范围" prop="range">
                      <el-input v-model="qualificationForm.frequency.range" placeholder="请输入频率范围"></el-input>
                    </el-form-item>
                    <el-form-item label="许可编号" prop="number">
                      <el-input v-model="qualificationForm.frequency.number" placeholder="请输入许可编号"></el-input>
                    </el-form-item>
                    <el-form-item label="有效期至" prop="expiry">
                      <el-date-picker v-model="qualificationForm.frequency.expiry" type="date" placeholder="请选择有效期至"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="上传许可" prop="file">
                      <el-upload
                        class="upload-demo"
                        action="#"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="qualificationForm.frequency.fileList"
                        :auto-upload="false"
                      >
                        <el-button type="primary"><el-icon><Upload /></el-icon> 点击上传</el-button>
                        <template #tip>
                          <div class="el-upload__tip">
                            只能上传jpg/png文件，且不超过2MB
                          </div>
                        </template>
                      </el-upload>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="handleSubmit('frequency')">提交</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          
          <!-- 飞行业务 -->
          <div v-if="activeMenu === 'flight'">
            <h2>飞行业务</h2>
            <div class="form-container">
              <el-tabs v-model="activeFlightTab">
                <el-tab-pane label="无人机飞行" name="droneFlight">
                  <el-steps :active="droneFlightStep" finish-status="success">
                    <el-step title="基本信息" description="填写飞行基本信息"></el-step>
                    <el-step title="飞行计划" description="制定飞行计划"></el-step>
                    <el-step title="上传材料" description="上传相关材料"></el-step>
                    <el-step title="提交审批" description="提交审批申请"></el-step>
                  </el-steps>
                  
                  <div class="step-content" style="margin-top: 30px;">
                    <!-- 基本信息 -->
                    <div v-if="droneFlightStep === 0">
                      <el-form :model="droneFlightForm.basic" :rules="droneFlightRules.basic" ref="droneBasicFormRef" label-width="120px">
                        <el-form-item label="飞行任务名称" prop="taskName">
                          <el-input v-model="droneFlightForm.basic.taskName" placeholder="请输入飞行任务名称"></el-input>
                        </el-form-item>
                        <el-form-item label="无人机型号" prop="droneModel">
                          <el-input v-model="droneFlightForm.basic.droneModel" placeholder="请输入无人机型号"></el-input>
                        </el-form-item>
                        <el-form-item label="飞行员姓名" prop="pilotName">
                          <el-input v-model="droneFlightForm.basic.pilotName" placeholder="请输入飞行员姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="contactPhone">
                          <el-input v-model="droneFlightForm.basic.contactPhone" placeholder="请输入联系电话"></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                    
                    <!-- 飞行计划 -->
                    <div v-if="droneFlightStep === 1">
                      <el-form :model="droneFlightForm.plan" :rules="droneFlightRules.plan" ref="dronePlanFormRef" label-width="120px">
                        <el-form-item label="起飞点" prop="takeoffPoint">
                          <el-input v-model="droneFlightForm.plan.takeoffPoint" placeholder="请输入起飞点"></el-input>
                        </el-form-item>
                        <el-form-item label="降落点" prop="landingPoint">
                          <el-input v-model="droneFlightForm.plan.landingPoint" placeholder="请输入降落点"></el-input>
                        </el-form-item>
                        <el-form-item label="飞行时间" prop="flightTime">
                          <el-date-picker v-model="droneFlightForm.plan.flightTime" type="datetime" placeholder="请选择飞行时间"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="飞行高度" prop="flightHeight">
                          <el-input v-model="droneFlightForm.plan.flightHeight" type="number" placeholder="请输入飞行高度（米）"></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                    
                    <!-- 上传材料 -->
                    <div v-if="droneFlightStep === 2">
                      <el-form :model="droneFlightForm材料" ref="drone材料FormRef" label-width="120px">
                        <el-form-item label="飞行员执照">
                          <el-upload
                            class="upload-demo"
                            action="#"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="droneFlightForm材料.pilotLicense"
                            :auto-upload="false"
                          >
                            <el-button type="primary"><el-icon><Upload /></el-icon> 点击上传</el-button>
                          </el-upload>
                        </el-form-item>
                        <el-form-item label="无人机注册证">
                          <el-upload
                            class="upload-demo"
                            action="#"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="droneFlightForm材料.droneRegistration"
                            :auto-upload="false"
                          >
                            <el-button type="primary"><el-icon><Upload /></el-icon> 点击上传</el-button>
                          </el-upload>
                        </el-form-item>
                        <el-form-item label="飞行计划">
                          <el-upload
                            class="upload-demo"
                            action="#"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="droneFlightForm材料.flightPlan"
                            :auto-upload="false"
                          >
                            <el-button type="primary"><el-icon><Upload /></el-icon> 点击上传</el-button>
                          </el-upload>
                        </el-form-item>
                      </el-form>
                    </div>
                    
                    <!-- 提交审批 -->
                    <div v-if="droneFlightStep === 3">
                      <el-form :model="droneFlightForm.submit" ref="droneSubmitFormRef" label-width="120px">
                        <el-form-item label="审批部门">
                          <el-select v-model="droneFlightForm.submit.approvalDept" placeholder="请选择审批部门">
                            <el-option label="民航局" value="civilAviation"></el-option>
                            <el-option label="空军" value="airForce"></el-option>
                            <el-option label="地方政府" value="localGovernment"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="备注">
                          <el-input v-model="droneFlightForm.submit.remark" type="textarea" placeholder="请输入备注"></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                    
                    <div class="step-buttons" style="margin-top: 30px;">
                      <el-button v-if="droneFlightStep > 0" @click="droneFlightStep--">上一步</el-button>
                      <el-button v-if="droneFlightStep < 3" type="primary" @click="droneFlightStep++">下一步</el-button>
                      <el-button v-if="droneFlightStep === 3" type="primary" @click="handleDroneFlightSubmit">提交审批</el-button>
                    </div>
                  </div>
                </el-tab-pane>
                
                <el-tab-pane label="通用航空飞行" name="generalAviation">
                  <el-steps :active="generalFlightStep" finish-status="success">
                    <el-step title="基本信息" description="填写飞行基本信息"></el-step>
                    <el-step title="飞行计划" description="制定飞行计划"></el-step>
                    <el-step title="上传材料" description="上传相关材料"></el-step>
                    <el-step title="提交审批" description="提交审批申请"></el-step>
                  </el-steps>
                  
                  <div class="step-content" style="margin-top: 30px;">
                    <!-- 基本信息 -->
                    <div v-if="generalFlightStep === 0">
                      <el-form :model="generalFlightForm.basic" :rules="generalFlightRules.basic" ref="generalBasicFormRef" label-width="120px">
                        <el-form-item label="飞行任务名称" prop="taskName">
                          <el-input v-model="generalFlightForm.basic.taskName" placeholder="请输入飞行任务名称"></el-input>
                        </el-form-item>
                        <el-form-item label="航空器型号" prop="aircraftModel">
                          <el-input v-model="generalFlightForm.basic.aircraftModel" placeholder="请输入航空器型号"></el-input>
                        </el-form-item>
                        <el-form-item label="飞行员姓名" prop="pilotName">
                          <el-input v-model="generalFlightForm.basic.pilotName" placeholder="请输入飞行员姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="contactPhone">
                          <el-input v-model="generalFlightForm.basic.contactPhone" placeholder="请输入联系电话"></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                    
                    <!-- 飞行计划 -->
                    <div v-if="generalFlightStep === 1">
                      <el-form :model="generalFlightForm.plan" :rules="generalFlightRules.plan" ref="generalPlanFormRef" label-width="120px">
                        <el-form-item label="起飞机场" prop="takeoffAirport">
                          <el-input v-model="generalFlightForm.plan.takeoffAirport" placeholder="请输入起飞机场"></el-input>
                        </el-form-item>
                        <el-form-item label="降落机场" prop="landingAirport">
                          <el-input v-model="generalFlightForm.plan.landingAirport" placeholder="请输入降落机场"></el-input>
                        </el-form-item>
                        <el-form-item label="飞行时间" prop="flightTime">
                          <el-date-picker v-model="generalFlightForm.plan.flightTime" type="datetime" placeholder="请选择飞行时间"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="飞行高度" prop="flightHeight">
                          <el-input v-model="generalFlightForm.plan.flightHeight" type="number" placeholder="请输入飞行高度（米）"></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                    
                    <!-- 上传材料 -->
                    <div v-if="generalFlightStep === 2">
                      <el-form :model="generalFlightForm材料" ref="general材料FormRef" label-width="120px">
                        <el-form-item label="飞行员执照">
                          <el-upload
                            class="upload-demo"
                            action="#"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="generalFlightForm材料.pilotLicense"
                            :auto-upload="false"
                          >
                            <el-button type="primary"><el-icon><Upload /></el-icon> 点击上传</el-button>
                          </el-upload>
                        </el-form-item>
                        <el-form-item label="航空器适航证">
                          <el-upload
                            class="upload-demo"
                            action="#"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="generalFlightForm材料.airworthinessCertificate"
                            :auto-upload="false"
                          >
                            <el-button type="primary"><el-icon><Upload /></el-icon> 点击上传</el-button>
                          </el-upload>
                        </el-form-item>
                        <el-form-item label="飞行计划">
                          <el-upload
                            class="upload-demo"
                            action="#"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="generalFlightForm材料.flightPlan"
                            :auto-upload="false"
                          >
                            <el-button type="primary"><el-icon><Upload /></el-icon> 点击上传</el-button>
                          </el-upload>
                        </el-form-item>
                      </el-form>
                    </div>
                    
                    <!-- 提交审批 -->
                    <div v-if="generalFlightStep === 3">
                      <el-form :model="generalFlightForm.submit" ref="generalSubmitFormRef" label-width="120px">
                        <el-form-item label="审批部门">
                          <el-select v-model="generalFlightForm.submit.approvalDept" placeholder="请选择审批部门">
                            <el-option label="民航局" value="civilAviation"></el-option>
                            <el-option label="空军" value="airForce"></el-option>
                            <el-option label="地方政府" value="localGovernment"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="备注">
                          <el-input v-model="generalFlightForm.submit.remark" type="textarea" placeholder="请输入备注"></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                    
                    <div class="step-buttons" style="margin-top: 30px;">
                      <el-button v-if="generalFlightStep > 0" @click="generalFlightStep--">上一步</el-button>
                      <el-button v-if="generalFlightStep < 3" type="primary" @click="generalFlightStep++">下一步</el-button>
                      <el-button v-if="generalFlightStep === 3" type="primary" @click="handleGeneralFlightSubmit">提交审批</el-button>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          
          <!-- 起飞点改航 -->
          <div v-if="activeMenu === 'diversion'">
            <h2>起飞点改航</h2>
            <div class="form-container">
              <el-form :model="diversionForm" :rules="diversionRules" ref="diversionFormRef" label-width="120px">
                <el-form-item label="原起飞点" prop="originalPoint">
                  <el-input v-model="diversionForm.originalPoint" placeholder="请输入原起飞点"></el-input>
                </el-form-item>
                <el-form-item label="新起飞点" prop="newPoint">
                  <el-input v-model="diversionForm.newPoint" placeholder="请输入新起飞点"></el-input>
                </el-form-item>
                <el-form-item label="改航原因" prop="reason">
                  <el-input v-model="diversionForm.reason" type="textarea" placeholder="请输入改航原因"></el-input>
                </el-form-item>
                <el-form-item label="改航时间" prop="diversionTime">
                  <el-date-picker v-model="diversionForm.diversionTime" type="datetime" placeholder="请选择改航时间"></el-date-picker>
                </el-form-item>
              </el-form>
              
              <div class="map-container">
                <div id="map"></div>
              </div>
              
              <div style="margin-top: 30px;">
                <el-button type="primary" @click="handleDiversionSubmit">提交改航申请</el-button>
              </div>
            </div>
          </div>
          
          <!-- 进度中心 -->
          <div v-if="activeMenu === 'progress'">
            <h2>进度中心</h2>
            <div class="progress-tabs">
              <el-tabs v-model="activeProgressTab">
                <el-tab-pane label="资质申请" name="qualificationProgress">
                  <el-table :data="qualificationProgressData" style="width: 100%">
                    <el-table-column prop="id" label="申请编号" width="180"></el-table-column>
                    <el-table-column prop="type" label="资质类型" width="180"></el-table-column>
                    <el-table-column prop="status" label="状态">
                      <template #default="scope">
                        <el-tag :type="scope.row.status === 'approved' ? 'success' : scope.row.status === 'rejected' ? 'danger' : 'warning'">
                          {{ scope.row.status === 'approved' ? '已通过' : scope.row.status === 'rejected' ? '已拒绝' : '处理中' }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="submitTime" label="提交时间" width="180"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
                    <el-table-column label="操作">
                      <template #default="scope">
                        <el-button size="small" @click="handleViewDetails(scope.row)">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                
                <el-tab-pane label="飞行申请" name="flightProgress">
                  <el-table :data="flightProgressData" style="width: 100%">
                    <el-table-column prop="id" label="申请编号" width="180"></el-table-column>
                    <el-table-column prop="type" label="飞行类型" width="180"></el-table-column>
                    <el-table-column prop="status" label="状态">
                      <template #default="scope">
                        <el-tag :type="scope.row.status === 'approved' ? 'success' : scope.row.status === 'rejected' ? 'danger' : 'warning'">
                          {{ scope.row.status === 'approved' ? '已通过' : scope.row.status === 'rejected' ? '已拒绝' : '处理中' }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="submitTime" label="提交时间" width="180"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
                    <el-table-column label="操作">
                      <template #default="scope">
                        <el-button size="small" @click="handleViewDetails(scope.row)">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                
                <el-tab-pane label="改航申请" name="diversionProgress">
                  <el-table :data="diversionProgressData" style="width: 100%">
                    <el-table-column prop="id" label="申请编号" width="180"></el-table-column>
                    <el-table-column prop="originalPoint" label="原起飞点" width="180"></el-table-column>
                    <el-table-column prop="newPoint" label="新起飞点" width="180"></el-table-column>
                    <el-table-column prop="status" label="状态">
                      <template #default="scope">
                        <el-tag :type="scope.row.status === 'approved' ? 'success' : scope.row.status === 'rejected' ? 'danger' : 'warning'">
                          {{ scope.row.status === 'approved' ? '已通过' : scope.row.status === 'rejected' ? '已拒绝' : '处理中' }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="submitTime" label="提交时间" width="180"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
                    <el-table-column label="操作">
                      <template #default="scope">
                        <el-button size="small" @click="handleViewDetails(scope.row)">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowDown, Home, Document, Plane, Map, Timer, Upload } from '@element-plus/icons-vue';

export default {
  name: 'App',
  setup() {
    // 登录状态
    const isLoggedIn = ref(false);
    const loginForm = reactive({
      username: '',
      password: ''
    });
    const loginRules = reactive({
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    });
    const loginFormRef = ref(null);
    const loginLoading = ref(false);
    const userInfo = reactive({
      username: '用户'
    });
    
    // 菜单状态
    const activeMenu = ref('dashboard');
    
    // 资质管理
    const activeQualificationTab = ref('pilot');
    const qualificationForm = reactive({
      pilot: {
        type: '',
        number: '',
        expiry: '',
        fileList: []
      },
      drone: {
        model: '',
        number: '',
        weight: '',
        fileList: []
      },
      airspace: {
        name: '',
        range: '',
        expiry: '',
        fileList: []
      },
      flightPlan: {
        number: '',
        area: '',
        time: '',
        fileList: []
      },
      groundStation: {
        name: '',
        address: '',
        expiry: '',
        fileList: []
      },
      frequency: {
        range: '',
        number: '',
        expiry: '',
        fileList: []
      }
    });
    const qualificationRules = reactive({
      pilot: {
        type: [{ required: true, message: '请选择执照类型', trigger: 'change' }],
        number: [{ required: true, message: '请输入执照号码', trigger: 'blur' }],
        expiry: [{ required: true, message: '请选择有效期至', trigger: 'change' }]
      },
      drone: {
        model: [{ required: true, message: '请输入无人机型号', trigger: 'blur' }],
        number: [{ required: true, message: '请输入注册号码', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入重量', trigger: 'blur' }]
      },
      airspace: {
        name: [{ required: true, message: '请输入空域名称', trigger: 'blur' }],
        range: [{ required: true, message: '请输入使用范围', trigger: 'blur' }],
        expiry: [{ required: true, message: '请选择有效期至', trigger: 'change' }]
      },
      flightPlan: {
        number: [{ required: true, message: '请输入计划编号', trigger: 'blur' }],
        area: [{ required: true, message: '请输入飞行区域', trigger: 'blur' }],
        time: [{ required: true, message: '请选择飞行时间', trigger: 'change' }]
      },
      groundStation: {
        name: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入站点地址', trigger: 'blur' }],
        expiry: [{ required: true, message: '请选择有效期至', trigger: 'change' }]
      },
      frequency: {
        range: [{ required: true, message: '请输入频率范围', trigger: 'blur' }],
        number: [{ required: true, message: '请输入许可编号', trigger: 'blur' }],
        expiry: [{ required: true, message: '请选择有效期至', trigger: 'change' }]
      }
    });
    const pilotFormRef = ref(null);
    const droneFormRef = ref(null);
    const airspaceFormRef = ref(null);
    const flightPlanFormRef = ref(null);
    const groundStationFormRef = ref(null);
    const frequencyFormRef = ref(null);
    
    // 飞行业务
    const activeFlightTab = ref('droneFlight');
    
    // 无人机飞行
    const droneFlightStep = ref(0);
    const droneFlightForm = reactive({
      basic: {
        taskName: '',
        droneModel: '',
        pilotName: '',
        contactPhone: ''
      },
      plan: {
        takeoffPoint: '',
        landingPoint: '',
        flightTime: '',
        flightHeight: ''
      },
      submit: {
        approvalDept: '',
        remark: ''
      }
    });
    const droneFlightForm材料 = reactive({
      pilotLicense: [],
      droneRegistration: [],
      flightPlan: []
    });
    const droneFlightRules = reactive({
      basic: {
        taskName: [{ required: true, message: '请输入飞行任务名称', trigger: 'blur' }],
        droneModel: [{ required: true, message: '请输入无人机型号', trigger: 'blur' }],
        pilotName: [{ required: true, message: '请输入飞行员姓名', trigger: 'blur' }],
        contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
      },
      plan: {
        takeoffPoint: [{ required: true, message: '请输入起飞点', trigger: 'blur' }],
        landingPoint: [{ required: true, message: '请输入降落点', trigger: 'blur' }],
        flightTime: [{ required: true, message: '请选择飞行时间', trigger: 'change' }],
        flightHeight: [{ required: true, message: '请输入飞行高度', trigger: 'blur' }]
      }
    });
    const droneBasicFormRef = ref(null);
    const dronePlanFormRef = ref(null);
    const drone材料FormRef = ref(null);
    const droneSubmitFormRef = ref(null);
    
    // 通用航空飞行
    const generalFlightStep = ref(0);
    const generalFlightForm = reactive({
      basic: {
        taskName: '',
        aircraftModel: '',
        pilotName: '',
        contactPhone: ''
      },
      plan: {
        takeoffAirport: '',
        landingAirport: '',
        flightTime: '',
        flightHeight: ''
      },
      submit: {
        approvalDept: '',
        remark: ''
      }
    });
    const generalFlightForm材料 = reactive({
      pilotLicense: [],
      airworthinessCertificate: [],
      flightPlan: []
    });
    const generalFlightRules = reactive({
      basic: {
        taskName: [{ required: true, message: '请输入飞行任务名称', trigger: 'blur' }],
        aircraftModel: [{ required: true, message: '请输入航空器型号', trigger: 'blur' }],
        pilotName: [{ required: true, message: '请输入飞行员姓名', trigger: 'blur' }],
        contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
      },
      plan: {
        takeoffAirport: [{ required: true, message: '请输入起飞机场', trigger: 'blur' }],
        landingAirport: [{ required: true, message: '请输入降落机场', trigger: 'blur' }],
        flightTime: [{ required: true, message: '请选择飞行时间', trigger: 'change' }],
        flightHeight: [{ required: true, message: '请输入飞行高度', trigger: 'blur' }]
      }
    });
    const generalBasicFormRef = ref(null);
    const generalPlanFormRef = ref(null);
    const general材料FormRef = ref(null);
    const generalSubmitFormRef = ref(null);
    
    // 起飞点改航
    const diversionForm = reactive({
      originalPoint: '',
      newPoint: '',
      reason: '',
      diversionTime: ''
    });
    const diversionRules = reactive({
      originalPoint: [{ required: true, message: '请输入原起飞点', trigger: 'blur' }],
      newPoint: [{ required: true, message: '请输入新起飞点', trigger: 'blur' }],
      reason: [{ required: true, message: '请输入改航原因', trigger: 'blur' }],
      diversionTime: [{ required: true, message: '请选择改航时间', trigger: 'change' }]
    });
    const diversionFormRef = ref(null);
    let map = null;
    
    // 进度中心
    const activeProgressTab = ref('qualificationProgress');
    const qualificationProgressData = ref([
      { id: 'Z001', type: '飞行员执照', status: 'approved', submitTime: '2024-01-01 10:00', updateTime: '2024-01-02 14:30' },
      { id: 'Z002', type: '无人机注册', status: 'processing', submitTime: '2024-01-03 09:00', updateTime: '2024-01-03 09:00' },
      { id: 'Z003', type: '空域使用证', status: 'rejected', submitTime: '2024-01-04 11:00', updateTime: '2024-01-05 10:00' }
    ]);
    const flightProgressData = ref([
      { id: 'F001', type: '无人机飞行', status: 'approved', submitTime: '2024-01-01 10:00', updateTime: '2024-01-02 14:30' },
      { id: 'F002', type: '通用航空飞行', status: 'processing', submitTime: '2024-01-03 09:00', updateTime: '2024-01-03 09:00' },
      { id: 'F003', type: '无人机飞行', status: 'rejected', submitTime: '2024-01-04 11:00', updateTime: '2024-01-05 10:00' }
    ]);
    const diversionProgressData = ref([
      { id: 'G001', originalPoint: '广州白云机场', newPoint: '深圳宝安机场', status: 'approved', submitTime: '2024-01-01 10:00', updateTime: '2024-01-02 14:30' },
      { id: 'G002', originalPoint: '珠海金湾机场', newPoint: '佛山沙堤机场', status: 'processing', submitTime: '2024-01-03 09:00', updateTime: '2024-01-03 09:00' },
      { id: 'G003', originalPoint: '汕头外砂机场', newPoint: '揭阳潮汕机场', status: 'rejected', submitTime: '2024-01-04 11:00', updateTime: '2024-01-05 10:00' }
    ]);
    
    // 通知
    const notifications = ref([
      { title: '系统更新', content: '系统将于2024年1月10日进行维护升级', time: '2024-01-05 09:00' },
      { title: '政策调整', content: '低空飞行管理政策有新的调整，请及时查看', time: '2024-01-04 14:30' },
      { title: '资质提醒', content: '您的飞行员执照即将到期，请及时更新', time: '2024-01-03 10:00' }
    ]);
    
    // 登录处理
    const handleLogin = async () => {
      if (!loginFormRef.value) return;
      
      try {
        await loginFormRef.value.validate();
        loginLoading.value = true;
        
        // 模拟登录请求
        setTimeout(() => {
          isLoggedIn.value = true;
          userInfo.username = loginForm.username;
          ElMessage.success('登录成功');
          loginLoading.value = false;
        }, 1000);
      } catch (error) {
        console.error('登录验证失败:', error);
      }
    };
    
    // 粤信签登录
    const handleYuexinqianLogin = () => {
      // 模拟粤信签登录
      ElMessage.info('正在跳转到粤信签登录页面...');
      setTimeout(() => {
        isLoggedIn.value = true;
        userInfo.username = '粤信签用户';
        ElMessage.success('登录成功');
      }, 1000);
    };
    
    // 退出登录
    const handleLogout = () => {
      isLoggedIn.value = false;
      activeMenu.value = 'dashboard';
      ElMessage.success('退出登录成功');
    };
    
    // 菜单选择
    const handleMenuSelect = (key) => {
      activeMenu.value = key;
    };
    
    // 预览上传文件
    const handlePreview = (file) => {
      console.log('预览文件:', file);
    };
    
    // 删除上传文件
    const handleRemove = (file, fileList) => {
      console.log('删除文件:', file);
      return true;
    };
    
    // 提交资质申请
    const handleSubmit = (type) => {
      let formRef;
      switch (type) {
        case 'pilot':
          formRef = pilotFormRef;
          break;
        case 'drone':
          formRef = droneFormRef;
          break;
        case 'airspace':
          formRef = airspaceFormRef;
          break;
        case 'flightPlan':
          formRef = flightPlanFormRef;
          break;
        case 'groundStation':
          formRef = groundStationFormRef;
          break;
        case 'frequency':
          formRef = frequencyFormRef;
          break;
        default:
          return;
      }
      
      if (!formRef.value) return;
      
      formRef.value.validate((valid) => {
        if (valid) {
          ElMessage.success('提交成功');
        } else {
          ElMessage.error('请填写所有必填项');
          return false;
        }
      });
    };
    
    // 提交无人机飞行申请
    const handleDroneFlightSubmit = () => {
      ElMessage.success('无人机飞行申请提交成功');
      droneFlightStep.value = 0;
    };
    
    // 提交通用航空飞行申请
    const handleGeneralFlightSubmit = () => {
      ElMessage.success('通用航空飞行申请提交成功');
      generalFlightStep.value = 0;
    };
    
    // 提交改航申请
    const handleDiversionSubmit = () => {
      if (!diversionFormRef.value) return;
      
      diversionFormRef.value.validate((valid) => {
        if (valid) {
          ElMessage.success('改航申请提交成功');
        } else {
          ElMessage.error('请填写所有必填项');
          return false;
        }
      });
    };
    
    // 查看详情
    const handleViewDetails = (row) => {
      ElMessage.info('查看详情: ' + row.id);
    };
    
    // 初始化地图
    const initMap = () => {
      if (map) return;
      
      map = L.map('map').setView([23.1291, 113.2644], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // 添加标记
      L.marker([23.1291, 113.2644]).addTo(map)
        .bindPopup('广州塔')
        .openPopup();
    };
    
    // 生命周期
    onMounted(() => {
      // 初始化地图
      setTimeout(() => {
        if (document.getElementById('map')) {
          initMap();
        }
      }, 1000);
    });
    
    return {
      isLoggedIn,
      loginForm,
      loginRules,
      loginFormRef,
      loginLoading,
      userInfo,
      activeMenu,
      activeQualificationTab,
      qualificationForm,
      qualificationRules,
      pilotFormRef,
      droneFormRef,
      airspaceFormRef,
      flightPlanFormRef,
      groundStationFormRef,
      frequencyFormRef,
      activeFlightTab,
      droneFlightStep,
      droneFlightForm,
      droneFlightForm材料,
      droneFlightRules,
      droneBasicFormRef,
      dronePlanFormRef,
      drone材料FormRef,
      droneSubmitFormRef,
      generalFlightStep,
      generalFlightForm,
      generalFlightForm材料,
      generalFlightRules,
      generalBasicFormRef,
      generalPlanFormRef,
      general材料FormRef,
      generalSubmitFormRef,
      diversionForm,
      diversionRules,
      diversionFormRef,
      activeProgressTab,
      qualificationProgressData,
      flightProgressData,
      diversionProgressData,
      notifications,
      handleLogin,
      handleYuexinqianLogin,
      handleLogout,
      handleMenuSelect,
      handlePreview,
      handleRemove,
      handleSubmit,
      handleDroneFlightSubmit,
      handleGeneralFlightSubmit,
      handleDiversionSubmit,
      handleViewDetails
    };
  }
};
</script>
