<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchVin" placeholder="输入VIN码" style="width: 200px;" class="filter-item" @keyup.enter.native="searchByVin" />
      <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="searchByVin">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-refresh" @click="reset">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-edit" @click="addCarDialogVisible = true">
        录入车辆
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!--      <el-table-column prop="id" align="center" label="ID" width="95"></el-table-column>-->
      <el-table-column prop="vin" label="VIN" width="200" align="center" />
      <el-table-column prop="model" label="车型" align="center" />
      <el-table-column prop="licensePlate" label="车牌号" width="180px" align="center" />
      <el-table-column label="价格" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.priceWanStr | priceFilter }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderStatusStr }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="操作" width="350px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">详情</el-button>
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button v-show="!(scope.row.orderNo)" size="mini" @click="handleOrder(scope.row.id)">检测下单</el-button>
          <el-button v-show="scope.row.orderStatus === 'WAITING_FOR_CHECK'" size="mini" @click="handleOrder(scope.row.id)">同步检测状态</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total="totalElements"
      class="pagination"
      @current-change="fetchData"
    />

    <el-dialog title="车辆录入" :visible.sync="addCarDialogVisible">
      <el-form label-position="right" label-width="80px" :model="car">
        <el-form-item label="车型">
          <el-input v-model="car.model" />
        </el-form-item>
        <el-form-item label="VIN">
          <el-input v-model="car.vin" />
        </el-form-item>
        <el-form-item label="价格(万)">
          <el-input v-model="car.price" />
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="car.licensePlate" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCarDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCar">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="车辆检测下单" :visible.sync="orderCarDialogVisible">
      <el-form label-position="right" label-width="80px" :model="car">
        <el-form-item label="车型">
          <el-input v-model="car.model" />
        </el-form-item>
        <el-form-item label="VIN">
          <el-input v-model="car.vin" />
        </el-form-item>
        <el-form-item label="价格(万)">
          <el-input v-model="car.price" />
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="car.licensePlate" />
        </el-form-item>
        <el-form-item label="联系人姓名">
          <el-input v-model="car.licensePlate" />
        </el-form-item>
        <el-form-item label="联系人电话">
          <el-input v-model="car.licensePlate" />
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="car.licensePlate" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="car.licensePlate" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCarDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCar">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { carList, add } from '@/api/car'
import { Message } from 'element-ui'

export default {
  filters: {
    statusFilter(row) {
      if (row.orderNo) {
        if (row.reportUrl) {
          return '已检测'
        } else {
          return '待检测'
        }
      } else {
        return ''
      }
    },
    priceFilter(price) {
      if (price) {
        return price + '万元'
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      orderCarDialogVisible: false,
      addCarDialogVisible: false,
      searchVin: '',
      list: null,
      listLoading: true,
      currentPage: 1,
      pageSize: 5,
      totalElements: 0,
      car: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      carList({ page: this.currentPage - 1, pageSize: this.pageSize, vin: this.searchVin }).then(response => {
        const body = response.body
        this.list = body.content
        this.totalElements = body.totalElements
        this.pageSize = body.size
        this.listLoading = false
      })
    },
    searchByVin() {
      this.currentPage = 1
      this.fetchData()
    },
    reset() {
      this.currentPage = 1
      this.searchVin = ''
      this.fetchData()
    },
    addCar() {
      console.log(this.car)
      add(this.car).then(response => {
        this.addCarDialogVisible = false
      }).catch(err => {
        Message.error(typeof (err) === 'string' ? err : err.msg)
      })
    },
    handleOrder(id) {
      return false
    }
  }
}
</script>
<style>
  .pagination {
    float: right;
    padding-right:20px;
    padding-top:20px;
  }
  .el-col {
    border-radius: 4px;
  }
</style>
