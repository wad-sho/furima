class OrdersController < ApplicationController

def index
  gon.public_key = ENV["PAYJP_PK"]
  @item = Item.find(params[:item_id])
  @order = OrderAddress.new
end


def create
  @item = Item.find(params[:item_id])
  @order = OrderAddress.new(order_params)
  gon.public_key = ENV["PAYJP_PK"]


  if @order.valid?
    paypay
    @order.save
    return redirect_to root_path
  end
  render 'index',status: :unprocessable_entity
end

  def paypay
    Payjp.api_key = ENV['PAYJP_SK']
    Payjp::Charge.create(
      amount: @item.price, # 商品の値段
      card: order_params[:token], # カードトークン
      currency: 'jpy'                 # 通貨の種類（日本円）
    )
  end

  private

  def order_params
    params.require(:order_address).permit(:postal_code, :prefecture_id, :address, :city, :building, :phone_number).merge(
      user_id: current_user.id, item_id: params[:item_id], token: params[:token]
    )
  end

  def set_purehase
    @item = Item.find(params[:item_id])
    redirect_to root_path if @item.order.present?
   
  end
end
