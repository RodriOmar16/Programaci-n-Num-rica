public class funcionEmpirica {
	public double listPtos[][];
	public int cant;
	public double a, b;
	
	public funcionEmpirica(int n){
		this.listPtos = new double[n][2];
		this.cant 	  = n;
	}
	
	//GETTER AND SETTERS
	public double[][] getListaPtos(){
		return this.listPtos;
	}
	public void setListaPtos(double l[][], int n) {
		setCantidad(n);
		for(int i=0; i<n ;i++) {
			for(int j=0; j<2 ;j++) {
				this.listPtos[i][j] = l[i][j];
			}
		}
	}
	
	public int getCantidad() {
		return this.cant;
	}
	public void setCantidad(int n) {
		this.cant = n;
	}
	
	public double getA() {
		return this.a;
	}
	public void setA(double a1) {
		this.a = a1;
	}
	
	public double getB() {
		return this.b;
	}
	public void setB(double b1) {
		this.b = b1;
	}
}
