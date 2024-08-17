import java.util.Scanner;

public class PolinomioAprox {
	public Matriz MatrizInterpolante; //matriz de coef
	public double ListaPtos[][]; //termninos independientes
	public double PolinomioInterpolante[]; 
	public int cantidad;
	
	//Constructor
	public PolinomioAprox(int n) {
		this.cantidad              = n;
		this.MatrizInterpolante    = new Matriz(n,n);
		this.ListaPtos             = new double[n][2];
		this.PolinomioInterpolante = new double[n];
	}
	//GETTERS AND SETTERS
	public int getCantidad() { return this.cantidad; }
	public void setCantidad(int n) { this.cantidad = n; }
	
	public double[][] getListaPtos() { return this.ListaPtos; }
	public void setListaPtos(double l[][], int n, int m) {
		this.ListaPtos = new double[n][m];

		for(int i=0; i<n ;i++) {
			for(int j=0; j<m ;j++) {
				this.ListaPtos[i][j] = l[i][j];
			}
		}
	}
	
	public double[] getPolinomioInterpolante() { return this.PolinomioInterpolante; }
	public void getPolinomioInterpolante(double p[]) {
		int n = this.PolinomioInterpolante.length;
		for(int i=0; i<n ;i++) {
			this.PolinomioInterpolante[i] = p[i];
		}
	}
	
	public double[][] getMatriz(){	return this.MatrizInterpolante.getMatrizCoef();  }
	
	//METODOS
	public void cargarPtos(){
		int n = this.cantidad;
		Scanner teclado = new Scanner(System.in);
		for(int i=0; i<n ;i++) {
			for(int j=0; j<2 ;j++) {
				if(j==0) {
					System.out.print("Ingresar coordenada x: ");
				}else System.out.print("Ingresar valor y = f(x): ");
				this.ListaPtos[i][j] = teclado.nextDouble();
			}
		}
	}
	public void mostrarPtos() {
		int n = this.cantidad;
		System.out.print("x | y = f(x)");
		for(int i=0; i<n ;i++) {
			System.out.print("\n----------------\n");	
			for(int j=0; j<2 ;j++) {
				if(j==0) {
					System.out.print(this.ListaPtos[i][j]+" | ");
				}else System.out.print(this.ListaPtos[i][j]);
			}
		}
	}

}
