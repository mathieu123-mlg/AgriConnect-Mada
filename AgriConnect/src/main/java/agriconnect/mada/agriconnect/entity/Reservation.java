package agriconnect.mada.agriconnect.entity;


import java.time.Instant;

public class Reservation {
    private Integer id;
    private User buyer;
    private User seller;
    private Double  price;
    private Double quantity;
    private StatusEnum status;
    private Instant creationDate;
    private Instant updateDate;
}
